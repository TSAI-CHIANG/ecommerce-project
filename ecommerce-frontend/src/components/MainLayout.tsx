import { Outlet } from 'react-router-dom';
import { ChatbotWidget } from './chatbot/ChatbotWidget';

// MainLayout：套用這個 Layout 的頁面才會有機器人
// <Outlet /> 是子頁面（HomePage、CheckoutPage 等）實際渲染的位置
// <Route> 下面還有其他 <Route> 的話，element 就需要放 <Outlet />，
// 否則 <Outlet /> 下面的元件（ChatbotWidget）就不會被渲染。
export function MainLayout() {
    return (
        <>
            <Outlet />
            {/* <Outlet /> 是一個「佔位符」——React Router 會把符合的子路由頁面塞進這個位置 */}
            <ChatbotWidget />
        </>
    );
}
