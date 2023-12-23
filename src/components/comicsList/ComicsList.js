import {useState, useEffect} from 'react';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [comicsEnded, setComicsEnded] = useState(false);
    const [offset, setOffset] = useState(0);

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onUpdateComics(offset, true)
        // Еслм передать вторым аргументом true, то я скажу коду, что это первичная загрузка (это значит что свойство newItemLoading будет со значением false и нам не нужно его активировать)
        // Но если у нас идет повторная загрузка, то вызывается ф-ия setNewItemLoading и изменяет его на true
    }, [])

    const onUpdateComics = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset)
            .then(onComicsListLoaded)
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if (newComicsList.length < 8) {
            ended = true;
        }

        setComicsList([...comicsList, ...newComicsList]);
        setNewItemLoading(false);
        setComicsEnded(ended);
        setOffset(offset + 8);
    }

    const renderItems = (arr) => {
        const items = arr.map((item, i) => {

            return (
                <li className="comics__item" key={i}>
                    <a href="#">
                        <img src={item.thumbnail} alt={item.title} className='comics__item-img'/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </a>
                </li>
            )
        })

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const items = renderItems(comicsList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button
                disabled={newItemLoading}
                className="button button__main button__long"
                style={{'display' : comicsEnded ? 'none' : 'block'}}
                onClick={() => onUpdateComics(offset)}>
                    <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;