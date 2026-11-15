from auth import hash_password
from database import init_db, SessionLocal, User, Folder, Card

def seed_db():
    init_db()
    db = SessionLocal()

    try:
        if db.query(User).filter_by(email="agnieszka@example.com").first() is None:
            user1 = User(
                email="agnieszka@example.com",
                password=hash_password("haslo123"),
            )

            Folder(name="polski", user=user1)
            Folder(name="matematyka", user=user1)
            Folder(
                name="języki",
                user=user1,
                subfolders=[
                    Folder(
                        name="kaszubski - kolory",
                        user=user1,
                        cards=[
                            Card(question="czerwony", answer="czerwony"),
                            Card(question="modri", answer="niebieski"),
                            Card(question="zélony", answer="zielony"),
                            Card(question="żôłti", answer="żółty"),
                            Card(question="fioletowi", answer="fioletowy"),
                            Card(question="malinkowy", answer="pomarańczowy"),
                            Card(question="czôrny", answer="czarny"),
                            Card(question="biôłi", answer="biały"),
                        ],
                    ),
                    Folder(
                        name="niemiecki - kolory",
                        user=user1,
                        cards=[
                            Card(question="rot", answer="czerwony"),
                            Card(question="blau", answer="niebieski"),
                            Card(question="grün", answer="zielony"),
                            Card(question="gelb", answer="żółty"),
                            Card(question="lila", answer="fioletowy"),
                            Card(question="orange", answer="pomarańczowy"),
                            Card(question="schwarz", answer="czarny"),
                            Card(question="weiß", answer="biały"),
                        ],
                    ),
                ],
            )

            db.add(user1)
            db.commit()
            print("db initialized.")
        else:
            print("db already exists.")

    finally:
        db.close()


if __name__ == "__main__":
    seed_db()