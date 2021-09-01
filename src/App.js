import React from "react";
import {Route, useHistory, useLocation} from 'react-router-dom';

import {ListFolder,AddFolder, Tasks} from "./components";

import axios from "axios";


function App() {

    const history = useHistory();
    const location = useLocation();

    const [list, setList] = React.useState(null);
    const [colors, setColors] = React.useState(null);
    const [selectFolder, setSelectFolder] = React.useState(null);

    React.useEffect(() => {
        axios.get('http://localhost:3001/lists?_expand=color&_embed=tasks')
            .then( ({data}) => setList(data));
        axios.get('http://localhost:3001/colors')
            .then( ({data}) => setColors(data));

    }, [])

    const onAddFolder = (obj) => {
        const newList = [
            ...list,
            obj,
        ]
        setList(newList);
    }

    const onSelectFolder = (folder) => {
        history.push(`/lists/${folder.id}`)
    }

    const onRemoveTask = (taskId, listId) => {
        console.log(taskId, listId)
        if(window.confirm('Вы действительно хотите удалить задачу?')){
            const newList = list.map((item) => {
                    if (item.id === listId){
                        item.tasks = item.tasks.filter((task) => task.id !== taskId)
                    }
                    return item
                })
            setList(newList);
            axios.delete('http://localhost:3001/tasks/' + taskId).catch(() => {
                alert('Не удалось удалить задачу ((');
            });
        }
    }

    const onEditTask = (taskObj, listId) => {
        const newTask = window.prompt('Введите вашу задачу 🤓', taskObj.text);
        if(!(newTask === '')){
            const newList = list.map((item) => {
                if(item.id === listId){
                    item.tasks.map((task) => {
                        if(task.id === taskObj.id){
                            task.text = newTask;
                        }
                        return task;
                    });
                }
                return item;
            });
            setList(newList);
            axios.patch('http://localhost:3001/tasks/' + taskObj.id, {
                text : newTask,
            }).catch(() => {
                alert('Не удалось изменить задачу ((');
            });
        } else {
            alert('Задача не может состоять из пустой строки!');
        }
    }

    const onAddTask = (listId, taskObj) => {
        const newList = list.map(item => {
            if(item.id === listId){
                item.tasks = [...item.tasks, taskObj];
            }
            return item;
        })
        setList(newList);
    }

    const onEditFolderTitle = (id, title) => {
        const newList = list.map((item) => {
            if(item.id === id){
                item.name = title;
            }
            return item;
        });
        console.log(newList);
        setList(newList);
    }

    const onCompleteTask= (listId, taskId, completed) => {
            const newList = list.map((item) => {
                if(item.id === listId){
                    item.tasks.map((task) => {
                        if(task.id === taskId){
                            task.completed = completed;
                        }
                        return task;
                    });
                }
                return item;
            });
            setList(newList);
            axios.patch('http://localhost:3001/tasks/' + taskId, {
                completed : completed,
            }).catch(() => {
                alert('Не удалось обновить задачу ((');
            });
    }

    React.useEffect(() => {
        const listId = history.location.pathname.split('lists/')[1];
        if(list){
            const FolderItem = list.find((item) => item.id === Number(listId));
            setSelectFolder(FolderItem);
        }
    }, [list, location.pathname, history.location.pathname]);

  return (
    <div className="todo">
        <div className="todo__sidebar">
            <ListFolder items={[
                {
                    active : location.pathname === '/',
                    name: 'Все задачи',
                    icon: (
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.96 8.10001H7.74001C7.24321 8.10001 7.20001 8.50231 7.20001 9.00001C7.20001 9.49771 7.24321 9.90001 7.74001 9.90001H12.96C13.4568 9.90001 13.5 9.49771 13.5 9.00001C13.5 8.50231 13.4568 8.10001 12.96 8.10001V8.10001ZM14.76 12.6H7.74001C7.24321 12.6 7.20001 13.0023 7.20001 13.5C7.20001 13.9977 7.24321 14.4 7.74001 14.4H14.76C15.2568 14.4 15.3 13.9977 15.3 13.5C15.3 13.0023 15.2568 12.6 14.76 12.6ZM7.74001 5.40001H14.76C15.2568 5.40001 15.3 4.99771 15.3 4.50001C15.3 4.00231 15.2568 3.60001 14.76 3.60001H7.74001C7.24321 3.60001 7.20001 4.00231 7.20001 4.50001C7.20001 4.99771 7.24321 5.40001 7.74001 5.40001ZM4.86001 8.10001H3.24001C2.74321 8.10001 2.70001 8.50231 2.70001 9.00001C2.70001 9.49771 2.74321 9.90001 3.24001 9.90001H4.86001C5.35681 9.90001 5.40001 9.49771 5.40001 9.00001C5.40001 8.50231 5.35681 8.10001 4.86001 8.10001ZM4.86001 12.6H3.24001C2.74321 12.6 2.70001 13.0023 2.70001 13.5C2.70001 13.9977 2.74321 14.4 3.24001 14.4H4.86001C5.35681 14.4 5.40001 13.9977 5.40001 13.5C5.40001 13.0023 5.35681 12.6 4.86001 12.6ZM4.86001 3.60001H3.24001C2.74321 3.60001 2.70001 4.00231 2.70001 4.50001C2.70001 4.99771 2.74321 5.40001 3.24001 5.40001H4.86001C5.35681 5.40001 5.40001 4.99771 5.40001 4.50001C5.40001 4.00231 5.35681 3.60001 4.86001 3.60001Z" fill="black"/>
                        </svg>
                    )
                }
            ]}
            onClickItem={(list) => history.push('/')}
            activeItem={false}
            />
            {list !== null ?
                <ListFolder items={list}
                    isRemovable onRemove={(id) => {
                        console.log(`Была удалена папка ${id}`);
                        const newList = list.filter((item) => item.id !== id);
                        setList(newList);
                    }
                }
                    activeItem={selectFolder && selectFolder.id}
                    onClickItem={(list) => onSelectFolder(list)}
                />
            :
                'Загрузка...'}
            <AddFolder onAdd={onAddFolder} colors={colors}/>
        </div>
        <div className="todo__tasks">
            <Route path="/" exact>
                {list && list.map((item,index) => (
                    <div key={item.id}>
                        <Tasks list={item} onAddTask={onAddTask}
                               onEditTitle={onEditFolderTitle} withoutEmpty={true}
                               onEditTask={onEditTask} onRemoveTask={onRemoveTask}
                               onCompleteTask={onCompleteTask}
                        />
                    </div>)
                )}
            </Route>
            {selectFolder &&
            <Tasks list={selectFolder} onAddTask={onAddTask}
                   onEditTitle={onEditFolderTitle} onRemoveTask={onRemoveTask}
                   onEditTask={onEditTask} onCompleteTask={onCompleteTask}
            />}
        </div>
    </div>
  );
}

export default App;