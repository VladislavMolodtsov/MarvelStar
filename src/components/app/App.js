import {lazy, Suspense} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// React.lazy() позволяет определять компонент, который загружается динамически. Это позволяет уменьшить размер сборки, откладывать загрузку на потом
// ... React.lazy() будет загружать в bundl компонент только тогда, когда компонент будет впервые отрендерен ...
// ... Например зашли мы первый раз на комикс, только тогда компонент загрузится с одним важным условием, компонент должен быть экспортирован по умолчанию
// Обязательно компонент который должен загрузится динамически должен быть экспортирован по умолчанию

import AppHeader from "../appHeader/AppHeader";
import Spinner from '../spinner/Spinner';

// Мы должны подгружать все динамические import после статических, иначе может возникнуть ошибка
// import { MainPage, ComicsPage, Page404, SingleComic } from "../pages/index";
const MainPage = lazy(() => import('../pages/MainPage'));
const ComicsPage = lazy(() => import('../pages/ComicsPage'));
const Page404 = lazy(() => import('../pages/404'));
const SingleComic = lazy(() => import('../singleComic/SingleComic'));

const App = () => {
    
    return (
        <Suspense fallback={<Spinner/>}>
        {/* Suspense есть обязательный аттрибут fallback={} - он нужен чтобы показать запасной компонент пока грузится динамический import */}
        {/* В него можно поместить react компонент и react элемент */}
            <Router>
                <div className="app">
                    <AppHeader/>
                    <main>
                        <Routes>
                            <Route path="/" element={<MainPage/>} />
                            <Route path="/comics" element={<ComicsPage/>} />
                            <Route path="/comics/:comicId" element={<SingleComic/>} />
                            <Route path="*" element={<Page404/>} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </Suspense>
    )
}

export default App;