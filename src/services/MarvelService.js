import { useHttp } from "../hooks/http.hook";
// Запросами занимается useHttp
// Когда MarvelService будет вызываться внутри него будет вызываться ф-ия useHttp() (наш кастомный хук, который отдаст нам объект с loading, request, error, clearError)

// useMarvelService - теперь это кастомный хук, который занимается запросом и трансформацией данных
const useMarvelService = () => {
    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=0b17abbf01ba2a59203081d3184f691e';
    const _offsetBase = 210;

    const {loading, request, error, clearError} = useHttp();
    // Второй способ это возможность вытащить сущность с этого hook

    // Для того чтобы работали методы мы подставляем const
    const getAllCharacters = async (offset = _offsetBase) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    // Так как это ф-ия, мы можем что-то из нее вернуть
    // Когда будет вызыватся useMarvelService, мы будем возвращать
    return {loading, error, clearError, getAllCharacters, getCharacter}
}

export default useMarvelService;