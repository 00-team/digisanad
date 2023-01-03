from pydantic import BaseModel

from settings import DEF_USER_PIC_DIR


class UserModel(BaseModel):
    user_id: int
    phone: str
    nickname: str | None
    picture: str | None
    token: str | None

    def picture_url(self, base_url: str) -> str | None:
        if not self.picture:
            return None

        return f'{base_url}media/users/{self.picture}'

    def clean_picture(self, new_picture):
        if self.picture and self.picture != new_picture:
            (DEF_USER_PIC_DIR / self.picture).unlink(True)


class VerificationModel(BaseModel):
    phone: str
    code: str
    action: str
    expires: int = 0
    tries: int = 0
