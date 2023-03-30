import React from 'react';
import { observable, autorun } from './mobx';
import { observer, useObserver } from './mobx-react';
// class Store {
//     number = 1
//     constructor() {
//         makeAutoObservable(this, {}, { autoBind: true });
//     }
//     add() {
//         this.number++;
//     }
// }

// let store = new Store();

const store = observable({
  number: 1,
  add(){
    this.number++
  }
})

console.log("store", store)

// export default observer(function () {
//     return (
//         <div>
//             <p>{store.number}</p>
//             <button onClick={() => store.add()}>+</button>
//         </div>
//     );
// });

@observer
class App extends React.Component {
  render() {
      return <div>
        <p>{store.number}</p>
        <button onClick={() => store.add()}>+</button>
      </div>
  }
}

export default App