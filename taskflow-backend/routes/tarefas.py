import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.tarefa import Tarefa
from schemas.tarefa import TarefaCreate, TarefaUpdate, TarefaResponse
from models.usuario import Usuario
from fastapi.responses import FileResponse


router = APIRouter()

@router.post("/", response_model=TarefaResponse)
def adicionar_tarefa(tarefa: TarefaCreate, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == tarefa.usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=400, detail="Usuário não encontrado")
    
    db_tarefa = Tarefa(**tarefa.model_dump())
    db.add(db_tarefa)
    db.commit()
    db.refresh(db_tarefa)
    
    return TarefaResponse(
        id=db_tarefa.id,
        titulo=db_tarefa.titulo,
        descricao=db_tarefa.descricao,
        status=db_tarefa.status,
        usuario_nome=usuario.nome, 
        usuario_id=usuario.id  
    )

@router.get("/", response_model=list[TarefaResponse])
def listar_tarefas(db: Session = Depends(get_db)):
    tarefas = db.query(Tarefa).join(Tarefa.usuario).all()
    return [
        TarefaResponse(
            id=tarefa.id,
            titulo=tarefa.titulo,
            descricao=tarefa.descricao,
            usuario_id=tarefa.usuario.id, 
            status=tarefa.status,
            usuario_nome=tarefa.usuario.nome 
        )
        for tarefa in tarefas
    ]

@router.put("/{tarefa_id}/", response_model=TarefaResponse)
def atualizar_tarefa(tarefa_id: int, tarefa_update: TarefaUpdate, db: Session = Depends(get_db)):
    db_tarefa = db.query(Tarefa).filter(Tarefa.id == tarefa_id).first()
    if db_tarefa is None:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    db_tarefa.status = tarefa_update.status
    db.commit()
    db.refresh(db_tarefa)
    return TarefaResponse(
        id=db_tarefa.id,
        titulo=db_tarefa.titulo,
        descricao=db_tarefa.descricao,
        status=db_tarefa.status,
        usuario_id=db_tarefa.usuario.id, 
        usuario_nome=db_tarefa.usuario.nome
          
    )

@router.delete("/{tarefa_id}/")
def deletar_tarefa(tarefa_id: int, db: Session = Depends(get_db)):
    db_tarefa = db.query(Tarefa).filter(Tarefa.id == tarefa_id).first()
    if db_tarefa is None:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    db.delete(db_tarefa)
    db.commit()
    return {"message": "Tarefa removida com sucesso"}

@router.get("/exportar-tarefas/")
def exportar_tarefas(db: Session = Depends(get_db)):
    try:
        # Consultando todas as tarefas do banco de dados
        tarefas = db.query(Tarefa).all()
        
        # Convertendo as tarefas para um formato de dicionário, removendo a instância de SQLAlchemy
        tarefas_list = [tarefa.__dict__ for tarefa in tarefas]
        for tarefa in tarefas_list:
            if '_sa_instance_state' in tarefa:
                del tarefa['_sa_instance_state']
        
        # Salvando as tarefas em um arquivo JSON
        with open("tasks.json", "w", encoding="utf-8") as file:
            json.dump(tarefas_list, file, ensure_ascii=False, indent=4)

        # Retornando o arquivo JSON para o cliente
        return FileResponse("tasks.json", media_type="application/json", filename="tasks.json")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao exportar tarefas: {str(e)}")