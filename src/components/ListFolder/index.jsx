import React from "react";
import './ListFolder.scss'
import classNames from "classnames";
import {Badge} from "../Badge";
import removeSvg from '../../assets/img/remove.svg'
import axios from "axios";

export const ListFolder = React.memo(
    ({items, isRemovable, onClick, isPopup, setVisiblePopup, onRemove, onClickItem, activeItem}) => {

    const removeFolder = (item) => {
        if(window.confirm('Вы действительно хотите удалить список?')){
            axios.delete('http://localhost:3001/lists/' + item.id).then(() => {
                onRemove(item.id);
            }).catch(() => alert('Не получилось удалить список(('))

        }
    }

    const popupRef = React.useRef(null);

    const handleOutsideClick = React.useCallback((event) => {
        if(items[0].name === 'Добавить папку'){
            console.log('render' , items[0].name)
            if(!event.path.includes(popupRef.current)){
                if(event.target.closest('.add__list-popup')){
                    return;
                }
                setVisiblePopup(false);
            }
        }

    } , [items, setVisiblePopup]);

    React.useEffect(() => {
        if(items.length > 0){
            if(items[0].name === 'Добавить папку'){
                document.addEventListener('click' , handleOutsideClick);

            }
        }
        return function cleanup() {
            if(items.length > 0){
                if(items[0].name === 'Добавить папку') {
                    document.removeEventListener('click' , handleOutsideClick);
                }
            }
        };
    });
    return (
        <ul className="list" >
            {items.map((item, index) => (
                <li ref={isPopup && popupRef} onClick={isPopup ? onClick : () => onClickItem(item)}
                    key={index + item.name}
                    className={classNames(
                        item.className,
                        {
                            'active' : item.active ? item.active : activeItem && activeItem === item.id,
                        }
                    )}>
                    <i>{item.icon ? (item.icon) : (
                        <Badge color={item.color.name}/>
                    )}</i>
                    <span>{item.name}{item.tasks && item.tasks.length > 0 && ` (${item.tasks.length})`}</span>
                    {isRemovable && (
                        <img className="list__remove-icon active"
                             src={removeSvg} alt="remove" onClick={() => removeFolder(item)}/>
                    )
                    }
                </li>
            ))}
        </ul>
    );
})