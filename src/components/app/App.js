import {lazy, Suspense} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import AppHeader from "../appHeader/AppHeader";
import Spinner from '../spinner/Spinner';

// import { MainPage, ComicsPage, Page404, SingleComic } from "../pages/index";
const MainPage = lazy(() => import('../pages/MainPage'));
const ComicsPage = lazy(() => import('../pages/ComicsPage'));
const Page404 = lazy(() => import('../pages/404'));
const SingleComic = lazy(() => import('../singleComic/SingleComic'));

const App = () => {
    
    return (
        <Suspense fallback={<Spinner/>}>
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