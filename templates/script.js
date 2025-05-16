const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _checkBtn = document.getElementById('check-answer');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');
const _correctScore = document.getElementById('correct-score');
const _totalQuestion = document.getElementById('total-question');
const _questionNumber = document.getElementById('question-number');

let correctAnswer = "", correctScore = 0, askedCount = 0;
let questionIndex = 0;

const questions = [
    {
        question: "What does 'Nifty 50' refer to?",
        options: [
            "A type of fixed deposit",
            "A group of top 50 companies listed on NSE",
            "A government tax plan",
            "A banking service"
        ],
        answer: "A group of top 50 companies listed on NSE"
    },
    {
        question: "Which regulatory body governs the stock market in India?",
        options: ["RBI", "SEBI", "IRDAI", "BSE"],
        answer: "SEBI"
    },
    {
        question: "What is a dividend?",
        options: [
            "A fee paid for buying stocks",
            "Profit shared by a company to shareholders",
            "An interest on bonds",
            "Tax on mutual funds"
        ],
        answer: "Profit shared by a company to shareholders"
    },
    {
        question: "Which of these is NOT a stock exchange?",
        options: ["NYSE", "NASDAQ", "BSE", "RBI"],
        answer: "RBI"
    },
    {
        question: "What is the full form of IPO?",
        options: [
            "Initial Public Offering",
            "Investment Planning Opportunity",
            "Institutional Portfolio Option",
            "Individual Public Ownership"
        ],
        answer: "Initial Public Offering"
    },
    {
        question: "What does BSE stand for?",
        options: [
            "Banking and Stock Exchange",
            "Bombay Stock Exchange",
            "Basic Stock Evaluation",
            "Balance Sheet Entry"
        ],
        answer: "Bombay Stock Exchange"
    },
    {
        question: "Which of the following best describes a 'bull market'?",
        options: [
            "Falling market",
            "Flat market",
            "Rising market",
            "Volatile market"
        ],
        answer: "Rising market"
    },
    {
        question: "In finance, ROI stands for:",
        options: [
            "Return on Investment",
            "Rate of Inflation",
            "Reserve on Insurance",
            "Reduction on Interest"
        ],
        answer: "Return on Investment"
    },
    {
        question: "What is a bear market?",
        options: [
            "A market where prices are rising",
            "A market where prices are falling",
            "A market with no trading activity",
            "A market controlled by large investors"
        ],
        answer: "A market where prices are falling"
    },
    {
        question: "What is a Demat account used for?",
        options: [
            "To store cash",
            "To save tax",
            "To hold securities electronically",
            "To pay EMIs"
        ],
        answer: "To hold securities electronically"
    },
    {
        question: "What does P/E ratio stand for?",
        options: [
            "Profit and Equity ratio",
            "Price to Earnings ratio",
            "Public Enterprise ratio",
            "Portfolio Evaluation ratio"
        ],
        answer: "Price to Earnings ratio"
    },
    {
        question: "What is market capitalization?",
        options: [
            "The total profit of a company",
            "Total value of a company's outstanding shares",
            "The capital reserved by a company",
            "The amount a company pays in taxes"
        ],
        answer: "Total value of a company's outstanding shares"
    },
    {
        question: "What is a blue-chip stock?",
        options: [
            "Stocks of newly listed companies",
            "Stocks of well-established companies with stable earnings",
            "Stocks that pay no dividends",
            "Stocks with high volatility"
        ],
        answer: "Stocks of well-established companies with stable earnings"
    },
    {
        question: "What is a stock split?",
        options: [
            "Dividing company's profits among shareholders",
            "Reducing the number of outstanding shares",
            "Increasing the number of shares by dividing existing ones",
            "Merging two companies' stocks"
        ],
        answer: "Increasing the number of shares by dividing existing ones"
    },
    {
        question: "What is a circuit breaker in stock markets?",
        options: [
            "A technical failure in trading systems",
            "A mechanism to temporarily halt trading during extreme price movements",
            "A limit on how many shares can be bought",
            "A tool to check electrical issues in the exchange"
        ],
        answer: "A mechanism to temporarily halt trading during extreme price movements"
    },
    {
        question: "What does SENSEX stand for?",
        options: [
            "Sensitive Exchange of India",
            "Sensitive Index",
            "Stock Exchange Numerical System",
            "Securities Exchange Sensor"
        ],
        answer: "Sensitive Index"
    },
    {
        question: "Which of these is a penny stock?",
        options: [
            "Stocks priced over $100",
            "Stocks of large multinational companies",
            "Low-priced, highly speculative stocks",
            "Government bonds"
        ],
        answer: "Low-priced, highly speculative stocks"
    },
    {
        question: "What is day trading?",
        options: [
            "Trading only during daytime hours",
            "Buying and selling securities within the same trading day",
            "Holding stocks for exactly one day",
            "Trading on specific days of the week"
        ],
        answer: "Buying and selling securities within the same trading day"
    },
    {
        question: "What is a limit order?",
        options: [
            "An order to buy/sell a stock at a specific price or better",
            "A limit on how many shares you can buy",
            "An order that must be executed immediately",
            "A restriction on trading certain stocks"
        ],
        answer: "An order to buy/sell a stock at a specific price or better"
    },
    {
        question: "What is a stock index?",
        options: [
            "The price of a specific stock",
            "A measurement of a section of the stock market",
            "A list of all stocks available for trading",
            "The profit margin of stock brokers"
        ],
        answer: "A measurement of a section of the stock market"
    },
    {
        question: "What are dividends usually paid from?",
        options: [
            "Company's assets",
            "Company's profits",
            "Investors' money",
            "Government subsidies"
        ],
        answer: "Company's profits"
    },
    {
        question: "What is a stock broker?",
        options: [
            "A company listed on the stock exchange",
            "A person who buys stocks for personal investment",
            "An intermediary who buys/sells stocks on behalf of others",
            "A government regulator of stock markets"
        ],
        answer: "An intermediary who buys/sells stocks on behalf of others"
    },
    {
        question: "What is margin trading?",
        options: [
            "Trading with borrowed money from broker",
            "Trading only within profit margins",
            "Trading during market closing hours",
            "Trading without paying taxes"
        ],
        answer: "Trading with borrowed money from broker"
    },
    {
        question: "What are preferred stocks?",
        options: [
            "Most popular stocks in the market",
            "Stocks that pay higher dividends than common stocks",
            "Stocks recommended by experts",
            "Stocks owned by company founders"
        ],
        answer: "Stocks that pay higher dividends than common stocks"
    },
    {
        question: "What is a stock buyback?",
        options: [
            "When investors return stocks to the company",
            "When a company purchases its own shares from the market",
            "When brokers buy back stocks they sold earlier",
            "When stocks are returned due to defects"
        ],
        answer: "When a company purchases its own shares from the market"
    }
];

const totalQuestion = questions.length;

function loadQuestion() {
    _result.innerHTML = "";
    if (questionIndex < questions.length) {
        showQuestion(questions[questionIndex]);
        _questionNumber.textContent = questionIndex + 1;
    }
}

function eventListeners() {
    _checkBtn.addEventListener('click', checkAnswer);
    _playAgainBtn.addEventListener('click', restartQuiz);
}

document.addEventListener('DOMContentLoaded', function () {
    loadQuestion();
    eventListeners();
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
    _questionNumber.textContent = 1;
});

function showQuestion(data) {
    _checkBtn.disabled = false;
    correctAnswer = data.answer;
    let optionsList = [...data.options];
    optionsList.sort(() => Math.random() - 0.5); // shuffle

    _question.innerHTML = `${data.question}`;
    _options.innerHTML = `
        ${optionsList.map((option, index) => `
            <li>${index + 1}. <span>${option}</span></li>
        `).join('')}
    `;
    selectOption();
}

function selectOption() {
    _options.querySelectorAll('li').forEach(function (option) {
        option.addEventListener('click', function () {
            const selected = _options.querySelector('.selected');
            if (selected) selected.classList.remove('selected');
            option.classList.add('selected');
        });
    });
}

function checkAnswer() {
    _checkBtn.disabled = true;
    const selectedOption = _options.querySelector('.selected');
    if (selectedOption) {
        const selectedAnswer = selectedOption.querySelector('span').textContent;
        if (selectedAnswer === correctAnswer) {
            correctScore++;
            _result.innerHTML = `<p><i class="fas fa-check"></i> Correct Answer!</p>`;
        } else {
            _result.innerHTML = `<p><i class="fas fa-times"></i> Incorrect Answer!</p><small><b>Correct Answer:</b> ${correctAnswer}</small>`;
        }
        checkCount();
    } else {
        _result.innerHTML = `<p><i class="fas fa-question"></i> Please select an option!</p>`;
        _checkBtn.disabled = false;
    }
}

function checkCount() {
    askedCount++;
    setCount();
    if (askedCount === totalQuestion) {
        setTimeout(showFinalResult, 1000);
    } else {
        setTimeout(() => {
            questionIndex++;
            loadQuestion();
        }, 1000);
    }
}

function setCount() {
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
}

function restartQuiz() {
    correctScore = askedCount = questionIndex = 0;
    _playAgainBtn.style.display = "none";
    _checkBtn.style.display = "block";
    _checkBtn.disabled = false;
    setCount();
    loadQuestion();
    _result.innerHTML = "";
    _questionNumber.textContent = 1;
}

function showFinalResult() {
    let percentage = (correctScore / totalQuestion) * 100;
    _result.innerHTML = `<p><strong>Final Score: ${correctScore}/${totalQuestion} (${percentage.toFixed(2)}%)</strong></p>`;
    _playAgainBtn.style.display = "block";
    _checkBtn.style.display = "none";
}
