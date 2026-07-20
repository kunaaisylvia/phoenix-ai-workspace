from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlmodel import Session, select

from backend.database.database import get_session
from backend.models.user import User
from backend.core.security import SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    print("\n==============================")
    print("AUTHENTICATION")
    print("==============================")
    print("TOKEN RECEIVED:")
    print(token)

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        print("\nJWT PAYLOAD:")
        print(payload)

        email = payload.get("sub")

        print("\nEMAIL FROM TOKEN:")
        print(email)

        if email is None:
            print("\nERROR: No email found inside token.")
            raise credentials_exception

    except JWTError as e:

        print("\nJWT ERROR:")
        print(e)

        raise credentials_exception

    user = session.exec(
        select(User).where(
            User.email == email
        )
    ).first()

    print("\nUSER FOUND:")
    print(user)

    if user is None:

        print("\nERROR: User does not exist.")

        raise credentials_exception

    print("\nAUTH SUCCESSFUL\n")

    return user