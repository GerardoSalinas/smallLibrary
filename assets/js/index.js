

const cardUtils = {
    removeCard: function (event){
        const bookId = event.target.parentNode.parentNode.id;
        event.target.parentNode.parentNode.remove();
        // updates localStorage
        const books = JSON.parse(window.localStorage.getItem("books"));
        const updatedBooks = books.filter((book) => book.id!=bookId);
        window.localStorage.setItem("books", JSON.stringify(updatedBooks));
    },

    toggleRead: function (event){
        const readSpan = event.target.parentNode.parentNode.querySelector("[data-card-read]");
        let booleanRead = true;
        if (readSpan.innerText === "Read"){
            readSpan.innerText = "Not read Yet"
            booleanRead = false;
        } else{
            readSpan.innerText = "Read";
            booleanRead = true;
        }
        // updates localStorage
        const bookId = event.target.parentNode.parentNode.id;
        const books = JSON.parse(window.localStorage.getItem("books"));
        const updatedBookIndex = books.findIndex( (element) => element.id === bookId );
        books[updatedBookIndex].read  = booleanRead;
        window.localStorage.setItem("books", JSON.stringify(books));
    },

    renderCard: function (book){
        const grid = document.querySelector(".card-container");
        const cardTemplate = document.querySelector("[data-card-template]");
        const card = cardTemplate.content.cloneNode(true).children[0];
        const bookTitle = card.querySelector("[data-card-book]");
        const author = card.querySelector("[data-card-author]");
        const pages = card.querySelector("[data-card-pages]");
        const read = card.querySelector("[data-card-read]");
        const removeBtn = card.querySelector("[data-card-removeBtn]");
        const readBtn = card.querySelector("[data-card-readBtn]");

        card.id = book.id;
        bookTitle.innerText = book.title;
        author.innerText = book.author;
        pages.innerText = book.pages;
        read.innerText = (book.read) ? "Read":"Not read yet";
        removeBtn.addEventListener("click",this.removeCard);
        readBtn.addEventListener("click",this.toggleRead);
        grid.appendChild(card);
    },

    loadLatestBook: function () {
        const latestBook = JSON.parse(window.localStorage.getItem("books")).at(-1);
        this.renderCard(latestBook);
    },

    updateCards: function (event) {
        const value = event.target.value.toLowerCase();
        const cards = document.querySelector(".card-container").children;
        for (let card of cards){
            const bookTitle = card.querySelector("[data-card-book]").innerText.toLowerCase();
            const author = card.querySelector("[data-card-author]").innerText.toLowerCase();
            if (bookTitle.includes(value) || author.includes(value)){
                card.style.display = "flex";
                console.log("tarjeta en pantalla" + card);
            }else{
                console.log("tarjeta oculta" + card);
                card.style.display = "none"; 
            }
        }
    }

}


const loadBooks = (function () {
    try {
        const storedBooks = JSON.parse(window.localStorage.getItem("books"));
        storedBooks.forEach(book => {
            cardUtils.renderCard(book);
        });
    } catch (error) {
        console.log("There are no books stored");
    }
})();


const modal = {
    backdrop: document.getElementById("modal-backdrop"),
    closeIcon: document.getElementById("close-modal-icon"),
    container: document.getElementById("modal-container"),
    body: document.getElementById("modal-body"),
    form: document.getElementById("modal-form"),

    toggle: function () {
        if (modal.backdrop.style.display === "none") {
            modal.backdrop.style.display = "flex"
            modal.closeIcon.style.display = "block"
            modal.container.style.display = "flex"
            modal.body.style.display = "flex"
            modal.form.style.display = "flex"
        }else{
            modal.backdrop.style.display = "none"
            modal.closeIcon.style.display = "none"
            modal.container.style.display = "none"
            modal.body.style.display = "none"
            modal.form.style.display = "none"
        }
    }
}


const addBookBtn = document.getElementById("add-book-btn");
addBookBtn.addEventListener("click", modal.toggle);

function extractInputData (){
    const inputData = Array.from(modal.form.getElementsByTagName("input"))
    .map((input) => input.type === "checkbox" ? input.checked : input.value)
    return inputData;
}

modal.closeIcon.addEventListener("click", modal.toggle);

function Book (title,author,pages,read){
    this.id = Date.now().toString()
    this.title = title
    this.author = author
    this.pages = pages
    this.read = read
}

Book.prototype.toggleRead = function () {
    this.read = !this.read;
}

Book.prototype.save = function () {
    var books = JSON.parse(window.localStorage.getItem("books"));
    if (books == null){
        books = [];
    }
    books.push(this);
    window.localStorage.setItem("books", JSON.stringify(books));
}

Book.prototype.remove = function () {
    window.localStorage.removeItem(this.id);
}


const formBtn = document.getElementById("formBtn");
formBtn.addEventListener("click", function () {
    const inputData = extractInputData();
    const newBook = new Book(inputData[0], inputData[1], inputData[2], inputData[3]);
    newBook.save();
    cardUtils.loadLatestBook();
    modal.toggle();
})

const searchBar = document.getElementById("search-bar");
searchBar.addEventListener("input", cardUtils.updateCards);

