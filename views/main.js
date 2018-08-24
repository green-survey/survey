var html = require('choo/html')
var css = require('sheetify')
var Nanocomponent = require('choo/component')
var surveys = require('../survey.json')
var mitt = require('mitt')
var emy = mitt()

var TITLE = '环保知识问卷'
var result = [null, null, null, null, null, null, null]
var answer = [1, 1, 0, 2, 1, 2, 3]

css('../styles')

module.exports = view

class Question extends Nanocomponent {
  constructor (data) {
    super()
    this.title = data.title
    this.options = data.options
    this.id = data.id
    this.handleClick = this.handleClick.bind(this)
    this.currentId = null
  }

  createElement () {
    return html`
      <li>
        <p class="mv2">${this.title}?</p>
        <form id="q1">          
            ${this.options.map((option, i) => {
              return html`
                <div class="flex mb2">
                  <i
                  onclick=${this.handleClick(this.id, i)}
                  class='${this.showResult ? '' : 'bg-white br2 b--blue ba bw015'} w12 h12 flex items-center justify-center mr1'>
                  ${this.currentId === i ? 
                    html`<i class='icon ${this.showResult ? (this.currentId === answer[this.id] ? "icon_agree" : "icon_wrong"): "icon_agree"}'></i>` : 
                    html`<i class='icon ${this.showResult ? (i === answer[this.id] ? "icon_agree" : ""): ""}'></i>`}
                  </i>              
                  <span 
                  onclick=${this.handleClick(this.id, i)}
                  class="items-center justify-center flex f5 ml1">
                  ${(i + 1) + "." + option}
                  </span>
                </div> 
              `
            })}                         
        </form>
      </li>
    `
  }  

  load () {
    emy.on('showResult', () => {
      this.showResult = true
      this.render()
    })
  }

  handleClick (id, subId) {
    return e => {
      if (this.showResult) {
        return 
      }

      this.currentId = subId
      result[id] = subId
      this.render()
    }
  }  

  update () {
    return true
  }  
}

class SButton extends Nanocomponent {
  constructor (data) {
    super()
  }

  createElement (destroy) {
    if (destroy) {
      return html`
        <div class="w-100 flex mb2">
        </div>
      `
    } else {
      return html`
        <div class="w-100 flex mb2">
        
          <section 
            onclick=${this.handleClick()}
            class="f5 br2 ba ph3 pv2 mb2 dib gold pointer grow ml4 center">
            查看答案
          </section>
        </div>
      `
    }

  }

  handleClick () {
    return e => {
      window.scrollTo(0, 0)      
      emy.emit('showResult')
      this.render(true)
    }
  }

  update () {
    return true
  }    
}

class Advertise extends Nanocomponent {
  constructor () {
    super()
  }  

  createElement () {
    if (this.showResult) {
      return html`
        <div>
          <p class='w-90 center dark-green'>
          Hi!      
          </p>          
          <p class='w-90 center dark-green'>
            我是一个普通的程序员，曾经在江西绿色之光环保组织做过志愿者，这个问卷就是在下做的。       
          </p>      
          <p class='w-90 center dark-green'>
            为了给垃圾分类的活动作准备，我正在做厨余堆肥实验。          
          </p> 
          <p class='w-90 center dark-green'>
            想想那些西瓜皮能变成肥料回馈土地，就觉得很美好。          
          </p>   
          <p class='w-90 center dark-green'>
            我正在合肥开展环保活动，欢迎联系！          
          </p>                                  
          <p class='w-90 center dark-green'>微信：</p>
          <img class='w-100' src='../assets/qrcode.png' />
          <img class='w-100' src='../assets/p1.png' />
          <img class='w-100' src='../assets/p2.png' />
          <img class='w-100' src='../assets/p3.png' />
          <img class='w-100' src='../assets/p4.JPG' />
        </div>
      `
    } else {
      return html`<div></div>`
    }
  } 

  load () {
    emy.on('showResult', () => {
      this.showResult = true
      this.render()
    })    
  }
  
  update () {
    return true
  }   
}

function view (state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)
  var sButton = new SButton()
  var advertise = new Advertise()
  return html`
    <body class="code lh-copy bg-washed-blue">
      <main class="pa1 cf center">
        <section class="fl mw6 w-100 w-third-l tc">
          <h2 class="tc dark-green mv3">${TITLE}</h2>
        </section>  
        <ol class="fl mw6 mt0 w-90 w-third-l dark-blue">
          ${surveys.map((survey, id) => {
            survey.id = id
            var question = new Question(survey)
            return question.render()
          })}
        </ol>  
        ${sButton.render()}   
        ${advertise.render()}                 
      </main>
      
    </body>
  `
}


