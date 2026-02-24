from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.page import Page
from app.schemas.page import PageCreate, PageUpdate, PageResponse

router = APIRouter(prefix="/pages", tags=["pages"])

@router.get("/", response_model=List[PageResponse])
def list_pages(db: Session = Depends(get_db)):
    return db.query(Page).order_by(Page.created_at.desc()).all()

@router.get("/{page_id}", response_model=PageResponse)
def get_page(page_id: int, db: Session = Depends(get_db)):
    page = db.query(Page).filter(Page.id == page_id).first()
    if not page:
        raise HTTPException(status_code=404, detail="Página não encontrada")
    return page

@router.post("/", response_model=PageResponse, status_code=201)
def create_page(page: PageCreate, db: Session = Depends(get_db)):
    existing = db.query(Page).filter(Page.slug == page.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug já existe")
    new_page = Page(**page.model_dump())
    db.add(new_page)
    db.commit()
    db.refresh(new_page)
    return new_page

@router.put("/{page_id}", response_model=PageResponse)
def update_page(page_id: int, page: PageUpdate, db: Session = Depends(get_db)):
    db_page = db.query(Page).filter(Page.id == page_id).first()
    if not db_page:
        raise HTTPException(status_code=404, detail="Página não encontrada")
    for key, value in page.model_dump(exclude_unset=True).items():
        setattr(db_page, key, value)
    db.commit()
    db.refresh(db_page)
    return db_page

@router.delete("/{page_id}", status_code=204)
def delete_page(page_id: int, db: Session = Depends(get_db)):
    db_page = db.query(Page).filter(Page.id == page_id).first()
    if not db_page:
        raise HTTPException(status_code=404, detail="Página não encontrada")
    db.delete(db_page)
    db.commit()

@router.post("/{page_id}/duplicate", response_model=PageResponse, status_code=201)
def duplicate_page(page_id: int, db: Session = Depends(get_db)):
    original = db.query(Page).filter(Page.id == page_id).first()
    if not original:
        raise HTTPException(status_code=404, detail="Página não encontrada")
    new_page = Page(
        title=f"{original.title} (cópia)",
        slug=f"{original.slug}-copia",
        template=original.template,
        content=original.content,
        is_published=False
    )
    db.add(new_page)
    db.commit()
    db.refresh(new_page)
    return new_page
