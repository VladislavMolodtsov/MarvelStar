import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Skeleton from '../skeleton/Skeleton';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charInfo.scss';
// import thor from '../../resources/img/thor.jpeg';

const CharInfo = (props) => {

    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const marvelService = new MarvelService();

    useEffect(() => {
        updateChar()
    }, [props.charId])

    const updateChar = () => {
        const {charId} = props;
        if (!charId) {
            return;
        }

        onCharLoading();

        marvelService
            .getCharacter(charId)
            .then(onCharLoaded)
            .catch(onError)
    }

    const onCharLoaded = (char) => {
        setChar(char);
        setLoading(false);
    }

    const onCharLoading = () => {
        setLoading(true);
    }

    const onError = () => {
        setLoading(false);
        setError(true);
    }

    const skeleton = char || loading || error ? null : <Skeleton />;
    const spinner = loading ? <Spinner /> : null;
    const errorMessage = error ? <ErrorMessage/> : null;
    const content = !(loading || error || !char) ? <View char={char}/> : null;

    return (
        <div className="char__info">
            {skeleton}
            {spinner}
            {errorMessage}
            {content}
        </div>
    )

}

const View = ({char}) => {

    const {name, description, homepage, wiki, thumbnail, comics} = char;

    let imgStyle = {'objectFit': 'cover'};
    if (thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
        imgStyle = {'objectFit': 'contain'};
    }

    return (
        <>
            <div className="char__basics">
            <img src={thumbnail} alt={name} style={imgStyle}/>
            <div>
                <div className="char__info-name">name</div>
                <div className="char__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'There is no comics for this character'}
                {
                    comics.map((item, i) => {
                        if (i > 9) return;
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        )
                    })
                }
            </ul>
        </>
        
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;