import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import useGetAllPost from '@/hooks/useGetAllPost'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'
import { useSelector } from 'react-redux'

const Home = () => {
    useGetAllPost();
    useGetSuggestedUsers();
    const { user } = useSelector(store => store.auth);
    console.log('user', user);
    return (
        <div className='flex'>
            <div className='flex-grow'>
                <Feed />
                <Outlet />
            </div>
            <div className='w-[350px]'>
                <RightSidebar />
            </div>
        </div>
    )
}

export default Home