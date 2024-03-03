const API_KEY = `76920f087955f921eb6b6f79d89fc42703ef032dc51e44b6ee7e4be168f2de59`;
const API_KEY1 = [`09f34dfde082ce1b964aeba567e3ecaab58fff794ea4607015ef0709449211a1`];
const API_KEY2 = `0d60452df08b29527128ee96f993660c1f3722369b9e8f087b6b69f215762f38`;

let url = new URL(`http://data4library.kr/api/loanItemSrch?authKey=${API_KEY}`);

let bookList = [];
let url1 = new URL('http://data4library.kr/api/srchBooks?');
let url2 = new URL('https://www.nl.go.kr/NL/search/openApi/search.do?');

let filterSelect = ['지역', '연령', '성별'];
const filterDefault = ['지역', '연령', '성별'];
const filterBtn = document.querySelectorAll('.filterBtn');
console.log(filterBtn);

const updateFilterSelect = (index, text) => {
    filterSelect[index] = text;
    console.log(filterSelect);

    for (let i = 0; i < filterBtn.length; i++) {
        if (filterSelect[i] !== filterDefault[i]) {
            filterBtn[i].style.display = 'inline';
        } else {
            filterBtn[i].style.display = 'none';
        }
        filterBtn[i].innerHTML = filterSelect[i];
    }
};

filterBtn.forEach((element, index) => {
    element.addEventListener('click', function () {
        console.log('click');
        filterSelect[index] = filterDefault[index];
        updateFilterSelect();
    });
});

// 날씨 아이콘
$.getJSON(
    'http://api.openweathermap.org/data/2.5/weather?id=1835848&appid=e185eb6e85e051757f1c4c54a4258982&units=metric',
    function (data) {
        //data로 할일 작성
        //alert(data.list[0].main.temp_min)
        let $minTemp = data.main.temp_min;
        let $maxTemp = data.main.temp_max;
        let $cTemp = data.main.temp;
        let $cDate = data.dt;
        let $wIcon = data.weather[0].icon;

        let $now = new Date($.now());

        //alert(new Date($.now()))
        //A.append(B) A요소의 내용 뒤에 B를 추가
        //A.prepend(B) A요소의 내용 앞에 B를 추가
        $('.clowtemp').append($minTemp.toFixed(1).toString() + '°C');
        $('.ctemp').append($cTemp.toFixed(1).toString() + '°C');
        $('.chightemp').append($maxTemp.toFixed(1).toString() + '°C');
        // $('h4').prepend($now.getFullYear()+'/'+($now.getMonth()+1)+'/'+$now.getDate()+'/'+$now.getHours()+":"+$now.getMinutes())
        $('.cicon').append('<img src="https://openweathermap.org/img/wn/' + $wIcon + '@2x.png">');
    }
);

// 인기대출도서 목록
let popularLoanBooksList = [];

// 지역, 성별, 나이 탭을 가져옴
const tabs = document.querySelectorAll('#yb-popular-loan-books-menu button');
console.log('tabs', tabs);
tabs.forEach((mode) => mode.addEventListener('click', (e) => popularLoanBooksFilter(e)));

let titleSearchList = [];
let authorSearchList = [];
let keywordSearchList = [];

const lineCount = 3;

const regionMenu = document.querySelectorAll('.region-menu');
const ageMenu = document.querySelectorAll('.age-menu');
const genderMenu = document.querySelectorAll('.gender-menu');

let resultNum = 0;
let page = 1;
const ybPageSize = 12;
const ybGroupSize = 5;
const pageSize = 10;
const groupSize = 5;

regionMenu.forEach((region) => region.addEventListener('change', (e) => getPopularLoanBooksByRegion(e)));
ageMenu.forEach((age) => age.addEventListener('change', (e) => getPopularLoanBooksByAge(e)));
genderMenu.forEach((gender) => gender.addEventListener('change', (e) => getPopularLoanBooksByGender(e)));
let response;
let date;

const popularLoanBooksFilter = (e) => {
    let mode = e.target.id;
    console.log('mode', mode);
    let filterHTML = ``;
    if (mode === 'region') {
        filterHTML = `
        <select id="filterSelectPlace" class="form-select region-menu" aria-label="Default select example">
            <option selected>전국</option>
            <option value="11">서울</option>
            <option value="21">부산</option>
            <option value="22">대구</option>
            <option value="23">인천</option>
            <option value="24">광주</option>
            <option value="25">대전</option>
            <option value="26">울산</option>
            <option value="29">세종</option>
            <option value="31">경기</option>
            <option value="32">강원</option>
            <option value="33">충북</option>
            <option value="34">충남</option>
            <option value="35">전북</option>
            <option value="36">전남</option>
            <option value="37">경북</option>
            <option value="38">경남</option>
            <option value="39">제주</option>
        </select>`;
        document.getElementById('filter').innerHTML = filterHTML;
        document.getElementById('filterSelectPlace').addEventListener('change', function () {
            updateFilterSelect(0, this.options[this.selectedIndex].text);
        });
    } else if (mode === 'age') {
        filterHTML = `
        <select id="filterSelectAge" class="form-select age-menu" aria-label="Default select example">
            <option selected value="-1">전체</option>
            <option value="0">영유아(0~5세)</option>
            <option value="6">유아(6~7세)</option>
            <option value="8">초등(8~13세)</option>
            <option value="14">청소년(14~19세)</option>
            <option value="20">20대</option>
            <option value="30">30대</option>
            <option value="40">40대</option>
            <option value="50">50대</option>
            <option value="60">60세 이상</option>
        </select>`;
        document.getElementById('filter').innerHTML = filterHTML;
        document.getElementById('filterSelectAge').addEventListener('change', function () {
            updateFilterSelect(1, this.options[this.selectedIndex].text);
        });
    } else if (mode === 'gender') {
        filterHTML = `
        <select id="filterSelectGender" class="form-select gender-menu" aria-label="Default select example">
            <option selected value="2">전체</option>
            <option value="0">남성</option>
            <option value="1">여성</option>
        </select>`;
        document.getElementById('filter').innerHTML = filterHTML;
        document.getElementById('filterSelectGender').addEventListener('change', function () {
            updateFilterSelect(2, this.options[this.selectedIndex].text);
        });
    }
    const regionMenu = document.querySelectorAll('.region-menu');
    const ageMenu = document.querySelectorAll('.age-menu');
    const genderMenu = document.querySelectorAll('.gender-menu');
    regionMenu.forEach((region) => region.addEventListener('change', (e) => getPopularLoanBooksByRegion(e)));
    ageMenu.forEach((age) => age.addEventListener('change', (e) => getPopularLoanBooksByAge(e)));
    genderMenu.forEach((gender) => gender.addEventListener('change', (e) => getPopularLoanBooksByGender(e)));
};

async function searchBook(keyword) {
    try {
        url1.searchParams.set('authKey', API_KEY1[0]);
        url1.searchParams.set('pageNo', 1);
        url1.searchParams.set('pageSize', 1);
        url1.searchParams.set('format', 'json');

        // title 검색
        url1.searchParams.set('title', keyword);
        response = await fetch(url1);
        if (!response.ok) {
            throw new Error(`책 검색 중 오류 발생: ${response.statusText}`);
        }
        data = await response.json();
        titleSearchList = data.response.docs;
        url1.searchParams.delete('title');

        // author 검색
        url1.searchParams.set('author', keyword);
        response = await fetch(url1);
        if (!response.ok) {
            throw new Error(`책 검색 중 오류 발생: ${response.statusText}`);
        }
        data = await response.json();
        authorSearchList = data.response.docs;
        url1.searchParams.delete('author');

        // keyword 검색
        url1.searchParams.set('keyword', keyword);
        response = await fetch(url1);
        if (!response.ok) {
            throw new Error(`책 검색 중 오류 발생: ${response.statusText}`);
        }
        data = await response.json();
        keywordSearchList = data.response.docs;
        url1.searchParams.delete('keyword');

        // if (titleSearchList.length === 0 && authorSearchList.length === 0 && keywordSearchList.length === 0) {
        //     throw new Error('검색어에 해당하는 책이 없습니다.');
        // }

        searchRender();
    } catch (error) {
        console.error(error);
    }
}

function searchRender() {
    let searchTitleBooksHTML = titleSearchList
        .map(
            (book) =>
                `<div class="card" onclick="getBookhj('${
                    book.doc.isbn13
                }')" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    <img src="${book.doc.bookImageURL}" alt="" />
                    <ul>
                        <li>제목<span>${
                            book.doc.bookname.split(':')[0].length >= 0
                                ? book.doc.bookname.split(':')[0].slice(0, 8) + '...'
                                : book.doc.bookname.split(':')[0]
                        }</span></li>
                        <li>작가<span>
                        ${
                            book.doc.authors.includes(';')
                                ? (book.doc.authors.split(';')[0].includes(':')
                                      ? book.doc.authors.split(';')[0].split(':')[1]
                                      : book.doc.authors.split(';')[0]) +
                                  '<br>' +
                                  book.doc.authors.split(';')[1]
                                : book.doc.authors.includes(':')
                                ? book.doc.authors.split(':')[1]
                                : book.doc.authors
                        }
                        
                        </span></li>
                    </ul>
                </div>`
        )
        .join('');

    let searchAuthorBooksHTML = authorSearchList
        .map(
            (book) =>
                `<div class="card" onclick="getBookhj('${
                    book.doc.isbn13
                }')" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    <img src="${book.doc.bookImageURL}" alt="" />
                    <ul>
                        <li>제목<span>${
                            book.doc.bookname.split(':')[0].length >= 0
                                ? book.doc.bookname.split(':')[0].slice(0, 8) + '...'
                                : book.doc.bookname.split(':')[0]
                        }</span></li>
                        <li>작가<span>
                        ${
                            book.doc.authors.includes(';')
                                ? (book.doc.authors.split(';')[0].includes(':')
                                      ? book.doc.authors.split(';')[0].split(':')[1]
                                      : book.doc.authors.split(';')[0]) +
                                  '<br>' +
                                  book.doc.authors.split(';')[1]
                                : book.doc.authors.includes(':')
                                ? book.doc.authors.split(':')[1]
                                : book.doc.authors
                        }
                        
                        </span></li>
                    </ul>
                </div>`
        )
        .join('');

    let searchKeywordBooksHTML = keywordSearchList
        .map(
            (book) =>
                `<div class="card" onclick="getBookhj('${
                    book.doc.isbn13
                }')" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    <img src="${book.doc.bookImageURL}" alt="" />
                    <ul>
                        <li>제목<span>${
                            book.doc.bookname.split(':')[0].length >= 0
                                ? book.doc.bookname.split(':')[0].slice(0, 8) + '...'
                                : book.doc.bookname.split(':')[0]
                        }</span></li>
                        <li>작가<span>
                        ${
                            book.doc.authors.includes(';')
                                ? (book.doc.authors.split(';')[0].includes(':')
                                      ? book.doc.authors.split(';')[0].split(':')[1]
                                      : book.doc.authors.split(';')[0]) +
                                  '<br>' +
                                  book.doc.authors.split(';')[1]
                                : book.doc.authors.includes(':')
                                ? book.doc.authors.split(':')[1]
                                : book.doc.authors
                        }
                        
                        </span></li>
                    </ul>
                </div>`
        )
        .join('');

    document.getElementById('title-holder').innerHTML = searchTitleBooksHTML;
    document.getElementById('author-holder').innerHTML = searchAuthorBooksHTML;
    document.getElementById('keyword-holder').innerHTML = searchKeywordBooksHTML;
}

// 더 보기
// 키워드, 타이틀, 작가, 가지고 가야한다.
// 어떤 더 보기를 클릭 했는 지 알아야 한다
const moreHolder = document.getElementById('mg-holder2');
let moreList = [];

async function moreSearcher(input) {
    let newUrl = new URL('http://data4library.kr/api/srchBooks?');

    newUrl.searchParams.set('authKey', API_KEY1[0]);

    if (input === 'keyword') {
        newUrl.searchParams.set('keyword', searchWord);
    } else if (input === 'author') {
        newUrl.searchParams.set('author', searchWord);
    } else if (input === 'title' || input == null || input === '') {
        newUrl.searchParams.set('title', searchWord);
    }

    newUrl.searchParams.set('pageSize', 1);
    // newUrl.searchParams.set('pageSize', itemCountCalculator());
    newUrl.searchParams.set('format', 'json');

    let response = await fetch(newUrl);
    let data = await response.json();
    moreList = data.response.docs;

    moreRender();
}

function moreRender() {
    let moreHtml = moreList
        .map(
            (book) =>
                `<div class="card" onclick="getBookhj('${
                    book.doc.isbn13
                }')" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    <img src="${book.doc.bookImageURL}" alt="" />
                    <ul>
                        <li>제목<span>${
                            book.doc.bookname.split(':')[0].length >= 0
                                ? book.doc.bookname.split(':')[0].slice(0, 8) + '...'
                                : book.doc.bookname.split(':')[0]
                        }</span></li>
                        <li>작가<span>
                        ${
                            book.doc.authors.includes(';')
                                ? (book.doc.authors.split(';')[0].includes(':')
                                      ? book.doc.authors.split(';')[0].split(':')[1]
                                      : book.doc.authors.split(';')[0]) +
                                  '<br>' +
                                  book.doc.authors.split(';')[1]
                                : book.doc.authors.includes(':')
                                ? book.doc.authors.split(':')[1]
                                : book.doc.authors
                        }
                        
                        </span></li>
                    </ul>
                </div>`
        )
        .join('');

    document.getElementById('more-holder').innerHTML = moreHtml;
}

const getPopularLoanBooks = async () => {
    url.searchParams.set('format', 'json');
    url.searchParams.set('startDt', '2024-01-01');
    url.searchParams.set('endDt', '2024-02-29');

    getPopularLoanBooksData();
};

const getPopularLoanBooksData = async () => {
    url.searchParams.set('pageNo', page);
    url.searchParams.set('pageSize', ybPageSize);
    const response = await fetch(url);
    console.log(response);
    const data = await response.json();

    popularLoanBooksList = data.response.docs;
    resultNum = data.response.resultNum;
    console.log(resultNum);
    popularLoanBooksRender();
    ybPaginationRender();
};

const getPopularLoanBooksByRegion = async (e) => {
    const region = e.target.value;
    console.log('region', region);
    url.searchParams.set('region', region);
    getPopularLoanBooksData();
};

const getPopularLoanBooksByAge = async (e) => {
    const age = e.target.value;
    console.log('age', age);
    url.searchParams.set('age', age);
    getPopularLoanBooksData();
};

// 한 페이지에 표시할 책의 수
function itemCountCalculator() {
    let result = 0;
    if (window.innerWidth < 451) result = 10;
    else if (window.innerWidth < 768) result = 10;
    else if (window.innerWidth < 992) result = 3 * lineCount;
    else if (window.innerWidth < 1200) result = 4 * lineCount;
    else if (window.innerWidth < 1400) result = 5 * lineCount;
    else if (window.innerWidth >= 1400) result = 6 * lineCount;

    console.log(result);
    return result;
}

const getPopularLoanBooksByGender = async (e) => {
    const gender = e.target.value;
    console.log('gender', gender);
    url.searchParams.set('gender', gender);
    getPopularLoanBooksData();
};

window.addEventListener('resize', itemCountCalculator);

// 검색창 부분
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const searchType = document.querySelectorAll('.search-type');

// 엔터
searchInput.addEventListener('keyup', function (e) {});

let searchWord = '';
// 검색 타입 버튼
searchType.forEach((btn) => {
    btn.addEventListener('click', function () {
        console.log(btn.id);
    });
});

const mgCardHolder = document.getElementById('mg-card-holder');
const ybPopularLoanBooksSection = document.getElementById('yb-popular-loan-boos-section');

// 검색 하기 버튼
searchBtn.addEventListener('click', function () {
    mgCardHolder.style.display = "block";
    ybPopularLoanBooksSection.style.display = "none";
    searchWord = searchInput.value.trim();

    if (!searchWord) {
        const returnVal = prompt('검색어를 입력해 주세요');

        if (returnVal) {
            searchInput.value = returnVal;
            console.log(returnVal);
            searchBook(returnVal);
        }
    } else {
        console.log(searchWord);
        searchBook(searchWord);
    }

    // document.getElementById('yb-popular-loan-books').style.display = 'none';
    // document.getElementById('"mg-card-holder').style.display = 'flex';
});

getPopularLoanBooks();

const popularLoanBooksRender = () => {
    const popularLoanBooksHTML = popularLoanBooksList
        .map(
            (book) =>
                `<div class = "col-lg-3 col-md-6 col-sm-12">
            <div class="card" style="width: 14.5rem;" onclick="getBookhj('${book.doc.isbn13}')" data-bs-toggle="modal" data-bs-target="#exampleModal">
        <div class = "yb-books-ranking">${book.doc.ranking}</div>
        <img src=${book.doc.bookImageURL} class="card-img-top" alt="..."> <!-- 책표지 URL-->
        <div class="card-body">
            <div class="card-title">${book.doc.bookname}</div>
            <div class="card-text">${book.doc.authors}</div>
            <div class="card-text">출판사 : ${book.doc.publisher}</div>
            <div class="card-text">출판년도 : ${book.doc.publication_year}</div>
        </div>
    </div>
    </div>`
        )
        .join('');
    document.getElementById('yb-popular-loan-books').innerHTML = popularLoanBooksHTML;
};

const ybPaginationRender = () => {
    //resultNum
    //page
    //pageSize
    //ybGroupSize
    //totalPages
    const ybTotalPages = Math.ceil(resultNum / ybPageSize);
    //pageGroup
    const ybPageGroup = Math.ceil(page / ybGroupSize);
    //ybLastPage
    let ybLastPage = ybPageGroup * ybGroupSize;
    if (ybLastPage < ybTotalPages) {
        ybLastPage = ybTotalPages;
    }

    //ybFirstPage
    const ybFirstPage = ybLastPage - (ybGroupSize - 1) <= 0 ? 1 : ybLastPage - (ybGroupSize - 1);

    let paginationHTML = ``;

    if (ybFirstPage >= 6) {
        paginationHTML = `<a class="page-link" onclick = "ybMoveToPage(1)" aria-label="First-Page">
        <span aria-hidden="true">&laquo;</span>
      </a><a class="page-link" onclick = "ybMoveToPage(${page - 1})" aria-label="Previous">
        <span aria-hidden="true">&lt;</span></a>`;
    }

    for (let i = ybFirstPage; i <= ybLastPage; i++) {
        paginationHTML += `<li class="page-item" onclick="ybMoveToPage(${i})"><a class="page-link">${i}</a></li>`;
    }

    if (ybLastPage < resultNum) {
        paginationHTML += `<a class="page-link" onclick = "ybMoveToPage(${page + 1})" aria-label="Next">
<span aria-hidden="true">&gt;</span>
</a><a class="page-link" onclick = "ybMoveToPage(${resultNum})"aria-label="Last-Page">
<span aria-hidden="true">&raquo;</span>
</a>`;
    }
    document.querySelector('.pagination').innerHTML = paginationHTML;
};

const ybMoveToPage = (pageNum) => {
    console.log('ybMoveToPage', pageNum);
    page = pageNum;
    getPopularLoanBooksData();
};

// 모달
const getBookhj = async (isbn13) => {
    const url2 = new URL(`https://data4library.kr/api/srchDtlList?authKey=${API_KEY2}`);
    url2.searchParams.set('isbn13', isbn13);
    url2.searchParams.set('format', 'json');
    const response = await fetch(url2);
    console.log(response);
    const data = await response.json();
    console.log(data);
    bookList = data.response.detail;

    console.log(data.response.docs, 'data');
    modalRender();
};

function modalRender() {
    console.log(bookList);
    let booksHTML = bookList
        .map(
            (book) =>
                `<div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">${book.book.bookname}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
                <img src="${book.book.bookImageURL}"/>
        </div>
            
        <div class="modal-footer">
            <ur class="modal-items">
                <li class="list-group-item">- 랭킹 :${book.book.no}</li>
                <li class="list-group-item">- 저자명 :${book.book.authors}</li>
                <li class="list-group-item">- 주제분류 :${book.book.class_nm}</li>
                <li class="list-group-item">- 출판사 :${book.book.publisher}</li>
                <li class="list-group-item">- 책소개 :${book.book.description}</li>
                <li class="list-group-item">- 발행년도 :${book.book.publication_year}</li>
                <li class="list-group-item">- ISBN :${book.book.isbn13}</li>
            </ur>
        </div>
        `
        )
        .join('');

    document.getElementById('modal-content').innerHTML = booksHTML;
}
