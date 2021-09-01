import React from "react";
import './AddListPopup.scss'
import closeSvg from '../../assets/img/close.svg'
import {ListFolder} from "../ListFolder";
import {Badge} from "../Badge";
import axios from "axios";


export function AddFolder ({colors, onAdd }) {

    const [visiblePopup, setVisiblePopup] = React.useState(false);
    const [activeColor, setActiveColor] = React.useState(3);
    const [inputValue, setInputValue] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const onClosePopup = () => {
        setInputValue('');
        setVisiblePopup(false);
        setActiveColor(colors[0].id);
    }

    const addList = () => {
        if(!inputValue){
            return alert('Название папки не может состоять из пустой строки!');
        }
        setIsLoading(true);
        axios.post('http://localhost:3001/lists' ,{name : inputValue , colorId: activeColor})
            .then(({data}) => {
                const color =  colors.filter((color) => color.id === activeColor)[0].name;
                const listObj = {...data,
                    color : {name : color},
                    tasks : []
                };
                onAdd(listObj);
                onClosePopup();
            }).catch(() => {
            alert('Не получилось отправить вашу задачу на сервер ((');
        }).finally(() => {
            setIsLoading(false);
        });
    }

    React.useEffect(() => {
        if(Array.isArray(colors)){
            setActiveColor(colors[0].id);
        }

    }, [colors]);

    const togglePopup = React.useCallback(() => {
        setVisiblePopup(!visiblePopup);
    }, [visiblePopup])

    return (
        <React.Fragment>
            <div >
                <ListFolder onClick={togglePopup} isPopup
                       visiblePopup={visiblePopup} setVisiblePopup={setVisiblePopup}
                       items={[
                     {
                         id : null,
                        className: 'list__button-add',
                        icon : (
                            <svg  width="12" height="12" viewBox="0 0 16 16" fill="#868686" xmlns="http://www.w3.org/2000/svg">
                                <path  d="M8 1V15" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path  d="M1 8H15" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        ),
                        name: 'Добавить папку',
                    },
                ]} />
            </div>
            {visiblePopup &&
            <div className="add__list-popup">
                <img src={closeSvg} onClick={onClosePopup}
                     alt="close" className="add__list-popup-close-btn"/>
                <input value={inputValue} type="text" placeholder="Название папки"
                       onChange={(event) => setInputValue(event.target.value)}/>
                <div className="colors">
                    {colors.map((item, index) => (
                        <Badge key={index + item.id} activeColor={activeColor}
                               onClick={() => setActiveColor(item.id)}
                               popup color={item.name} id={item.id}
                               className={activeColor === item.id && "active-color"}
                        />
                    ))}
                    {/*{colors.map((item,index) => (<div key={index+item.id}*/}
                    {/*    onClick={() => setActiveColor(item.id)}*/}
                    {/*    style={{backgroundColor: `${item.hex}`}}*/}
                    {/*    className={item.id === activeColor ? 'active-color color': 'color'}>*/}
                    {/*</div>))}*/}
                </div>
                <button onClick={addList} className="button">{isLoading ? 'Добавление...' : 'Добавить'}</button>
            </div>}
        </React.Fragment>
    );
}