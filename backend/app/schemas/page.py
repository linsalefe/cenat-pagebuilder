from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PageCreate(BaseModel):
    title: str
    slug: str
    template: str
    content: dict = {}

class PageUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[dict] = None
    is_published: Optional[bool] = None

class PageResponse(BaseModel):
    id: int
    title: str
    slug: str
    template: str
    content: dict
    is_published: bool
    created_by: Optional[int]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
