import React from 'react';

import addSvg from "../../assets/img/add.svg";
import axios from "axios";

export const AddTaskForm = ({list, onAddTaskForm}) => {

    const [visibleForm, setVisibleForm] = React.useState(false);
    const [inputValue, setInputValue] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const toggleVisibleForm = () => {
        setVisibleForm(!visibleForm);
    }

    const onAddTask = () => {
        const obj = {
            "listId": list.id,
            "text": inputValue,
            "completed": false
        };
        setIsLoading(true);
        axios.post('http://localhost:3001/tasks', obj)
            .then(({data}) => {
            obj.id = data.id;
            onAddTaskForm(list.id, obj);
        }).catch(() => {
            alert('Не получилось отправить вашу задачу на сервер ((');
        }).finally(() => {
            toggleVisibleForm();
            setInputValue('');
            setIsLoading(false);
        });
    }
    return (
        <div className="tasks__form">
            {visibleForm ?
                <div className="tasks__form-create">
                    <input value={inputValue} onChange={(event) => setInputValue(event.target.value)}
                           type="text" name="" id="" placeholder="Текст задачи"/>
                    <button onClick={onAddTask} disabled={isLoading}
                            className={isLoading ? "button button-disabled" :"button button-green"}>
                        {isLoading ? 'Добавление...' : 'Добавить задач'}</button>
                    <button  className="button button-grey"
                             onClick={toggleVisibleForm}>Отмена</button>
                </div> :
                <div className="tasks__form-new">
                    <img onClick={toggleVisibleForm} src={addSvg} alt="Add task"/>
                    <span onClick={toggleVisibleForm}>Новая задача</span>
                </div>
            }
        </div>
    );
};