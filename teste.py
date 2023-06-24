class Book:
    def __init__(self, id, title, author, date):
        self.id = id
        self.title = title
        self.author = author
        self.date = date

    def __repr__(self) -> str:
        return f"{self.title}"


class BookData:
    id = 0

    def __init__(self, title, author, date):
        self.id = BookData.get_id()
        self.title = title
        self.author = author
        self.date = date

    @staticmethod
    def get_id():
        BookData.id += 1
        return BookData.id

    def __getitem__(self, attr):
        return getattr(self, attr)

    def __repr__(self):
        return f"{self.title}/{self.id}"


book1 = Book(1, "Harry Potter", "J.K. Rowling", "1997")
book2 = Book(2, "The Lord of the Rings", "J.R.R. Tolkien", "1954")
book3 = Book(3, "The Hobbit", "J.R.R. Tolkien", "1937")
book4 = Book(4, "Alice in Wonderland", "Lewis Carroll", "1865")

book_data_1 = BookData(book1.title, book1.author, book1.date)
book_data_2 = BookData(book2.title, book2.author, book2.date)
book_data_3 = BookData(book3.title, book3.author, book3.date)
book_data_4 = BookData(book4.title, book4.author, book4.date)

instance = [book1, book2, book3, book4]
validated_data = [book_data_1, book_data_2, book_data_3, book_data_4]

book_mapping = {book.id: book for book in instance}
data_mapping = {item["id"]: item for item in validated_data}

print(book_mapping)
print(data_mapping)
