from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.authentication import get_current_user
from app.models.sqlModels import User

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me")
def read_users_me(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    #First query the public table
    db_user = db.query(User).filter(User.id == current_user.id).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    #Return data
    return {
        "id": db_user.id,
        "email": db_user.email,
        "display_name": db_user.display_name,
        "avatar_url": db_user.avatar_url,
        "settings": db_user.settings
    }