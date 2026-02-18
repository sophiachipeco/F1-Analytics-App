from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.sqlModels import User
from app.models.schemas import UserLogin, UserRegister, UserResponse, OAuthLogin
from app.services.authentication import get_current_user, verify_password, hash_password
import uuid

router = APIRouter(prefix="/users", tags=["Users"])
security = HTTPBearer(auto_error=False)


@router.post("/register", response_model=UserResponse)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Hash the password with bcrypt
    hashed_password = hash_password(user_data.password)

    # Create new user
    new_user = User(
        id=uuid.uuid4(),
        email=user_data.email,
        hashed_password=hashed_password,
        display_name=user_data.display_name,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return UserResponse(
        id=str(new_user.id),
        email=new_user.email,
        display_name=new_user.display_name,
        avatar_url=new_user.avatar_url,
    )


@router.post("/login", response_model=UserResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login user with email and password"""
    print(f"Login attempt for email: {credentials.email}")
    user = db.query(User).filter(User.email == credentials.email).first()

    if not user:
        print(f"User not found: {credentials.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    # Verify the plain password against the stored bcrypt hash
    is_valid = verify_password(credentials.password, user.hashed_password)
    print(f"Password verification result: {is_valid}")
    
    if not is_valid:
        print(f"Password mismatch for user: {credentials.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    print(f"Login successful for user: {credentials.email}")
    return UserResponse(
        id=str(user.id),
        email=user.email,
        display_name=user.display_name,
        avatar_url=user.avatar_url,
    )


@router.post("/oauth-login", response_model=UserResponse)
def oauth_login(oauth_data: OAuthLogin, db: Session = Depends(get_db)):
    """Login or register user via OAuth (Google)"""
    print(f"OAuth login attempt for email: {oauth_data.email}, provider: {oauth_data.provider}")
    
    # Check if user exists
    user = db.query(User).filter(User.email == oauth_data.email).first()
    
    if not user:
        # Create new user from OAuth
        print(f"Creating new user from {oauth_data.provider}: {oauth_data.email}")
        user = User(
            id=uuid.uuid4(),
            email=oauth_data.email,
            display_name=oauth_data.display_name,
            avatar_url=oauth_data.avatar_url,
            hashed_password="oauth",  # OAuth users don't have a password
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # Update user info if they provided new avatar
        if oauth_data.avatar_url and not user.avatar_url:
            user.avatar_url = oauth_data.avatar_url
            db.commit()
    
    print(f"OAuth login successful for user: {oauth_data.email}")
    return UserResponse(
        id=str(user.id),
        email=user.email,
        display_name=user.display_name,
        avatar_url=user.avatar_url,
    )


@router.get("/me", response_model=UserResponse)
def read_users_me(
    current_user=Depends(get_current_user), db: Session = Depends(get_db)
):
    """Get current user info"""
    db_user = db.query(User).filter(User.id == current_user.id).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserResponse(
        id=str(db_user.id),
        email=db_user.email,
        display_name=db_user.display_name,
        avatar_url=db_user.avatar_url,
    )