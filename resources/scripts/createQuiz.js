var form
var infoDiv
function fetchQuiz(){
    if( isNaN(this.numOfQues)){
        setInfo('Please use only numbers in this choice!')
        return;
    }
    if(this.numOfQues > 100) {
        setInfo('Enter less than 100 questions please!')
        return;
    }
    
    var apiUrl = "https://opentdb.com/api.php?"
    var queryParameters = new URLSearchParams()

    queryParameters.append('amount',this.numOfQues)

    this.category != 0 && queryParameters.append('category',this.category)
    this.difficulty != 0 && queryParameters.append('difficulty',this.difficulty)
    
    apiUrl += queryParameters.toString()

    var xhr = new XMLHttpRequest()
    xhr.open( 'GET', apiUrl )
    xhr.send()
    xhr.onload = function(){
        if( this.status == 200){
            var response = JSON.parse( this.response )
            if( response.response_code == 0 ){
                processQuestions( response.results )
                window.location = "quiz.html"
            }else{
                setInfo('Error in loading the questions')
            }
        }
    }
    var img = document.createElement('img')
    img.setAttribute('src',"./resources/images/spin.gif")
    setInfo('loading',img)
    
}


//parsing the question into requred format
function processQuestions( questionList ){
    quiz = {}
    quiz.totalQuestions = questionList.length
    quiz.currentQuestionNo = 0
    quiz.questionsList = questionList.map( processQuestion )
    localStorage.setItem( 'quiz', JSON.stringify( quiz ) )
}

function processQuestion( q ){
    question = {}

    question.category = q.category
    question.text = q.question
    var noOfOptions = q.incorrect_answers.length
    var randomInt = Math.floor( Math.random() * noOfOptions )
    question.options = q.incorrect_answers
    question.options.splice( randomInt, 0,q.correct_answer )
    question.correctAnswer = randomInt
    question.recordedAnswer = -1

    return question
}

function setInfo( info, element ){
    infoDiv.textContent = ""
    infoDiv.append( info )
    element && infoDiv.append( element )
}

function formHandler( callback ){
    event.preventDefault()
    
    var inputs = event.target.querySelectorAll( 'input , select ' )
    inputs = Array.from( inputs ).filter( function(ele){
            return ele.type != 'submit'
        })
    var data = {}    
    
    inputs.forEach( function( input ){
        if( input.name ){        
            data[input.name] = input.value
        }
    })

    callback.call( data )
}

window.addEventListener('load',function(){
    form = document.getElementById('quizForm')
    infoDiv = document.getElementById('info')
    form.addEventListener('submit', function(){
        formHandler( fetchQuiz )
    })
})