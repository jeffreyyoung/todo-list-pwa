import React, {useState} from 'react'
import {useLocalStorage} from 'react-use';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import './App.css';


let SortableItemsContainer = SortableContainer(({children}) => {
  return (<ul>{children}</ul>);
})

const SortableItem = SortableElement(({children}) => {
  return children;
})
const DeleteButton   = ({setState,state, index}) => (
  <button
    onClick={() => {
      let nextState = [...state];
      nextState.splice(index, 1);
      setState(nextState);
    }}
    className='ml1'>-</button>
)

const AddButton = ({setState,state, index}) => (
  <button
    onClick={() => {
      let res = window.prompt('What should your todo be entered as?')
      let nextState = [...state];
      nextState.splice(index+1, 0, {
        type: 'ITEM',
        name: res
      });
      setState(nextState);
    }}
    className='ml1'>+</button>
)

const EmptyWrapper = ({children}) => (<>{children}</>);

const Home = () => {

  let [state, setState] = useLocalStorage('todos',[
    {
      type: 'TITLE',
      name: 'Today',
    },
    {
      type: 'ITEM',
      name: 'Do Something Today'
    },
    { 
      type: 'TITLE',
      name: 'Tomorrow',
    },
    {
      type: 'ITEM',
      name: 'Buy food'
    },
    {
      type: 'TITLE',
      name: 'Eventually',
    },
    {
      type: 'ITEM',
      name: 'Buy more food'
    },
  ]);

  return (
  <>
    <header><h5 className='pa2 mv2 tc'>Todo Party 🥳</h5></header>
    <main>
      <SortableItemsContainer
        pressDelay={200}
        useWindowAsScrollContainer={true}
        onSortEnd={({oldIndex, newIndex}) => {
        
        setState(arrayMove(
          state,
          oldIndex,
          newIndex === 0 ? 1 : newIndex
        ));
      }}>
        {state.map((item, i) => {
          if (item.type === 'TITLE') {
              let Wrapper = i === 0 ? EmptyWrapper : SortableItem;
              return (
                <Wrapper
                  key={i + item.type + item.name}
                  index={i}
                  disabled={true}
                >
                  <li className='no-bullet title row'><h2>{item.name}</h2><AddButton state={state} setState={setState} index={i}/></li>
                </Wrapper>
              );

          } else {
            return (
              <SortableItem 
                key={i + item.type + item.name}
                index={i}
              >
                <li className='pa2'>{item.name} <DeleteButton state={state} setState={setState} index={i} /></li>
              </SortableItem>);
          }
        })}
      </SortableItemsContainer>
      
    </main>

  </>
);
}

export default Home;