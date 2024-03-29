import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './charList.scss';
// import abyss from '../../resources/img/abyss.jpg';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [charEnded, setCharEnded] = useState(false);
    const [offset, setOffset] = useState(210);

    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
        onUpdateChar(offset, true);
        // Еслм передать вторым аргументом true, то я скажу коду, что это первичная загрузка (это значит что свойство newItemLoading будет со значением false и нам не нужно его активировать)
        // Но если у нас идет повторная загрузка, то вызывается ф-ия setNewItemLoading и изменяет его на true
    }, [])

    const onUpdateChar = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharLoaded)
    }

    const onCharLoaded = (newCharList) => {

        // Для того чтобы вытащить эти ф-ии, мы должны использовать асинхронный синтаксис деструктуризации
        // Так как эта операция у нас асинхронная, тоесть обращение к другому файлу, то мы должны использовать await
        // ассинхронная потому что мы не знаем через сколько она вернет ответ
        
        // const {logger, secondLog} = await import('./someFunc');
        // logger();

        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setNewItemLoading(false);
        setCharEnded(ended);
        setOffset(offset => offset + 9)
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    function renderItems(arr) {

        const items = arr.map((item, i) => {

            let imgStyle = {'objectFit': 'cover'};
            if (item.thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
                imgStyle = {'objectFit': 'contain'};
            }

            return (
                <li 
                    className="char__item"
                    tabIndex={0}
                    key={item.id}
                    ref={(el) => itemRefs.current[i] = el}
                    // itemRefs.current - в данной ф-ии возвращает undefined, но когда в параметрах мы передаем el - только тогда мы получаем элемент li который мы помещаем внутрь массива itemRefs = useRef([]);
                    onClick={() => {
                        props.onCharSelected(item.id);
                        focusOnItem(i);
                    }}
                    handleKeyPress={(e) => {
                        if (e.key === '' || e.key === "Enter") {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }
                    }}>
                    
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        })

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    const items = renderItems(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;
    // У меня есть загрузка, но при этом это не загрузка новых компонентов(персонажей)

    // При данной загрузке я хотел бы отправлять какие-то данные на какой-то сервер
    // Когда мы запустили страницу, я увидел что в консоли вывелось 2-а раза logger ...
    // ... Первый раз когда прогрузился компонет, а второй раз когда изменился state (тоесть загрузились данные) 
    // Мы взяли какуе-ту ф-ию с стороннего файла и просто его поместили в другой файл (сделали это динамически при помощи условия)
    // Это открывает новые возможности, которые позволяют загружать нужные файлы только тогда, когда это действительно нужно
    // ... а не полностью вкидывать все файлы в одну сборку
    // if (loading) {
    //     // Данный динамический импорт всегда возвращает promise с объектом модуля
    //     import('./someFunc')
    //         // .then(obj => obj.logger())

    //         // Теперь мы чтобы вызвать данную ф-ию, должны вызвать через свойство default
    //         .then(obj => obj.default())
    //         .catch();
    // }

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => onUpdateChar(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )

}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;