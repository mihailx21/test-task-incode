import React from "react";
import Table from "./tableComponent/tableComponent";
import DataListDynamic from "./addingComponent/addingComponent";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

// starting data
let data  = [
  {"ticker": "AAPL","exchange": "NASDAQ","price": 279.29,"change": 64.52,"change_percent": 0.84,"dividend": 0.56,"yield": 1.34,"last_trade_time": "2021-04-30T11:53:21.000Z"},
  {"ticker":"GOOGL","exchange":"NASDAQ","price":237.08,"change":154.38,"change_percent":0.10,"dividend":0.46,"yield":1.18,"last_trade_time":"2021-04-30T11:53:21.000Z"},
  {"ticker":"MSFT","exchange":"NASDAQ","price":261.46,"change":161.45,"change_percent":0.41,"dividend":0.18,"yield":0.98,"last_trade_time":"2021-04-30T11:53:21.000Z"},
  {"ticker":"AMZN","exchange":"NASDAQ","price":260.34,"change":128.71,"change_percent":0.60,"dividend":0.07,"yield":0.42,"last_trade_time":"2021-04-30T11:53:21.000Z"},
  {"ticker":"FB","exchange":"NASDAQ","price":266.77,"change":171.92,"change_percent":0.75,"dividend":0.52,"yield":1.31,"last_trade_time":"2021-04-30T11:53:21.000Z"},
  {"ticker":"TSLA","exchange":"NASDAQ","price":272.13,"change":158.76,"change_percent":0.10,"dividend":0.96,"yield":1.00,"last_trade_time":"2021-04-30T11:53:21.000Z"}
]

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      data: data,
      existingNames: [],
      prevData: [],
    }
    this.removeItem = this.removeItem.bind(this);
    this.addItem = this.addItem.bind(this)
  };

  componentDidMount(){
    socket.emit("start");
    socket.on("ticker", (response)=> {
      //get data before updating
      this.setState({
        prevData: this.state.data
      })
      //is array testing
      let trueResponse =  Array.isArray(response) ? response : [response];
      //update data in state
      this.setState({
        etalonData: trueResponse.map(el=> Object.assign(el)),
        data: this.state.data ? this.correctionData(trueResponse) : trueResponse.map(el=> Object.assign(el))
      });
    });
  }


  //upload only onscreen tickers 
  correctionData(trueResponse){ 
    let oldData = this.state.data;
    let newData = trueResponse.map(el=> Object.assign(el));
    let temp;
    temp = oldData.map(elem => 
      Object.assign(
        newData.find(element =>{
          if(elem.ticker === element.ticker)
            return element;
          else
            return 0
        })
      )
    )
    return temp
  }

  // get normal name (AAPL -> Apple)
  getTrueName(ticker) {
    const trueNames = {
      AAPL: "Apple",
      GOOGL: "Alphabet",
      MSFT: "Microsoft",
      AMZN: "Amazon",
      FB: "Facebook",
      TSLA: "Tesla"

    };
    let normalName;
    for(let key in trueNames){
      if(key === ticker){
          normalName = trueNames[key];
      }
    }
    return normalName;
  }

  //get ticker name (Apple -> AAPL)
  converToTicker(value){
    const trueNames = {
      Apple: "AAPL",
      Alphabet: "GOOGL",
      Microsoft:"MSFT",
      Amazon: "AMZN",
      Facebook:"FB",
      Tesla: "TSLA"

    };
    let normalName;
    for(let key in trueNames){
      if(key === value){
          normalName = trueNames[key];
      }
    }
    return normalName;
  }

  //deleting ticker from screen on button click
  removeItem(name){
    let temp = this.state.data.filter(el => el.ticker !== name)
    this.setState({
      data: temp
    })
    let tmp = this.state.existingNames.concat([name]);
    this.setState({
      existingNames: tmp
    })
  }
    
  //adding existing tickers
  addItem(){
    let arrayOfNamesChanged = []
    let inputValue = document.getElementById('inputList').value
    let tickers = [];

    inputValue = this.converToTicker(inputValue);
    this.state.etalonData.map((el=>tickers.push(el.ticker)))
    
    let tickersOnScreen = [];
    this.state.data.map(el => tickersOnScreen.push(el.ticker))

    //checking input conditions, like empty input, etc
    if(inputValue !== "" && tickers.includes(inputValue) && !tickersOnScreen.includes(inputValue)){
      let existingElement;
      let i = arrayOfNamesChanged.indexOf(inputValue);
      this.state.etalonData.map((el)=>arrayOfNamesChanged.push(el.ticker))
      //looking ticker on arrayOfNamesChanged
      if (i === -1) {
        for(let j = 0; j<this.state.etalonData.length; j++){
          if(this.state.etalonData[j].ticker === inputValue)
            existingElement = Object.assign({}, this.state.etalonData[j])
        }
        this.state.existingNames.pop()
        let tmp = this.state.existingNames
        this.setState({
          data: this.state.data.concat([existingElement]),
          existingNames: tmp
        })

      }
      //clearing input on end input
      document.getElementById('inputList').value = '';
    }
    else
      document.getElementById('inputList').value = '';
  }

  render(){
    return (
    <table>
      <tbody>
        {
          this.state.data.map((position)=>
            <Table 
              position = {position} 
              key={`${position.ticker + position.exchange}`} 
              removeItem={this.removeItem} 
              getTrueName={this.getTrueName}
              oldData = {this.state.prevData}
            />)
        }
      </tbody>
      <tfoot>
        <DataListDynamic
          names = {this.state.existingNames} 
          addItem = {this.addItem} 
          getTrueName = {this.getTrueName}
        />
      </tfoot>
    </table>
    );
  };
}



//Static app with starting data

// function App(){
//   let dataCopy = data.map(el=>Object.assign(el))
//   let [contextdata, setContextData] = useState(dataCopy);

//   // socket.emit("start");
//   // socket.on("ticker", (response)=> {
//   //     //is array
//   //     console.log("socket answer");
//   //     let trueResponse =  Array.isArray(response) ? response : [response];
//   //     //upload data in state
//   //     setContextData(trueResponse.map(el=> Object.assign(el)))
//   // });

//   let existingNames = [];
//   //алгоритм перебора всех значение contexdata и сравнения его с data, если совпадение ничего не делат, если context нету значения то добавить его имя из data в existingNames
//   let namesData = [];
//   let namesContextData = [];

//   data.map(el=>namesData.push(el.ticker));
//   contextdata.map(el=>namesContextData.push(el.ticker));

//   namesData.map(el=>
//     !namesContextData.includes(el) ? existingNames.push(el) : false
//     )

//   function getTrueName(ticker) {
//     const trueNames = {
//       AAPL: "Apple",
//       GOOGL: "Alphabet",
//       MSFT: "Microsoft",
//       AMZN: "Amazon",
//       FB: "Facebook",
//       TSLA: "Tesla"

//     };
//     let normalName;
//     for(let key in trueNames){
//       if(key === ticker){
//           normalName = trueNames[key];
//       }
//     }
//     return normalName;
//   }

//   function converToTicker(value){
//     const trueNames = {
//       Apple: "AAPL",
//       Alphabet: "GOOGL",
//       Microsoft:"MSFT",
//       Amazon: "AMZN",
//       Facebook:"FB",
//       Tesla: "TSLA"

//     };
//     let normalName;
//     for(let key in trueNames){
//       if(key === value){
//           normalName = trueNames[key];
//       }
//     }
//     return normalName;
//   }
  
//   //удаление оп клику на кнопке
//   function removeItem(name){
//     setContextData(
//       contextdata.filter(el => el.ticker !== name)
//     )
//   }

//   //добавление удалённых элементов
//   function addItem(){
//     let arrayOfNamesChanged = []
//     let inputValue = document.getElementById('inputList').value
//     let tickers = [];

//     inputValue = converToTicker(inputValue);
//     data.map((el=>tickers.push(el.ticker)))
    
//     //проверка на пустое поле и на любой другой ввод, кроме названия ticker
//     if(inputValue !== "" && tickers.includes(inputValue)){
//       let existingElement;
//       let i = arrayOfNamesChanged.indexOf(inputValue);
//       contextdata.map((el)=>arrayOfNamesChanged.push(el.ticker))
//       //поиcк по массиву имён arrayOfNamesChanged. При совпадении => ничего не делать, при отсутсвии => добавить отсутвующий элемент из массива data
//       if (i === -1) {
//         for(let j = 0; j<data.length; j++){
//           if(data[j].ticker === inputValue)
//             existingElement = Object.assign({}, data[j])
//         }
//         setContextData(
//           contextdata.concat([existingElement])
//         )
//       }
//       //чистим поле ввода после клика
//       document.getElementById('inputList').value = '';
//     }
//     else
//       document.getElementById('inputList').value = '';
//   }

//   return(
//     <table>
//       <tbody>
//         {
//           contextdata.map((position)=><Table position = {position} key={`${position.ticker + position.exchange}`} removeItem={removeItem} getTrueName={getTrueName}/>)  
//         }
//       </tbody>
//       <tfoot>
//         <DataListDynamic names = {existingNames} addItem = {addItem} getTrueName = {getTrueName}/>
//       </tfoot>
//     </table>
//   )
// }


export default App;