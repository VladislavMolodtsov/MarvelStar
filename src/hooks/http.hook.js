import { useState, useCallback } from 'react';

// use - означает пользовательский hook // Http - hook который будет работать с запросами
// Важно вынести повторяющейся сущности и отдельный компонент
export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Внутри компонента есть несколько состояний - поэтому изменения будет происходить во время запроса
    // Ф-ию request будем помещать внутри нашего приложения в том числе она может передаваться внутрь дочерных компонентов
    // Поскольку это функция отвечающая за запрос, то мы вместе с ф-ией используем async await  
    // url - это куда мы будем посылать запрос,
    const request = useCallback( async (url, method = 'GET', body = null, headers = {'Content-type': 'application/json'}) => {
        
        // Перед тем как отправить запрос мы с вами должны поставить загрузку в true
        setLoading(true);

        // Этот метод будет только отправлять запрос на сервер, а не обрабатывать его при помощи then, catch, finally, поэтому мы будем использовать конструкцию try - catch
        try {
            const response = await fetch(url, {method, body, headers});

            if (!response.ok) {
                throw new Error (`Could not fetch ${url}, status ${response.status}`);
            }

            // await используем чтобы подождать результат работы асинхронной операции
            const data = await response.json();

            setLoading(false);

            return data;
        } catch(e) {
            // Используем setLoading(false) ответ от сервера завершился ошибкой
            setLoading(false);
            // Вызываем setError и передаем сообщение об ошибке всесто первоначального параметра null
            // setError - мы устанавливаем ошибку, но нет функции для того чтобы чистить наши ошибки и мы могли сного пользоваться кнопкой try it для переключения персонажа в CharRandom
            // Решение создать ф-ию clearError для того чтобы выходить с данной ситуации
            setError(true);
            throw e;
        }
    }, [])
    // Пустой массив зависимостей означает что ф-ия вызовится только один раз

    const clearError = useCallback(() => setError(null), [])
    // функция будет чистить наши ошибки, а ф-ия useHttp - отображала ошибки

    return {loading, request, error, clearError};

}