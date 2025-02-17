from pydantic import BaseModel

class TarefaBase(BaseModel):
    titulo: str
    descricao: str
    status: str = "Pendente"
    usuario_id: int

class TarefaCreate(TarefaBase):
    pass

class TarefaUpdate(BaseModel):
    status: str

class TarefaResponse(BaseModel):
    id: int
    titulo: str
    descricao: str
    status: str
    usuario_nome: str
    usuario_id: int  

    class Config:
        orm_mode = True
