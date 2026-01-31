import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import ProfileInfoCard from "../cards/profileInfoCard";

const DashboardLayout = ({ activeMenue, children }) => {
  const { user } = useContext(UserContext);
  return (
    <div className='w-full min-h-screen bg-[url("/bg.jpg")] bg-cover bg-center '>
      <div className="h-16 backdrop-blur-[2px]  py-2.5 px-4 md:px-0 sticky top-0 z-30 ]">
        <div className="mx-auto flex items-center justify-between gap-5 pr-5 ">
          <Link to="/dashboard">
            <div className="text-xl font-bold flex p-3">
              <img src="/logo.svg" alt="" className=" w-10 h-10 " />
              AI Resume Builder
            </div>
          </Link>

          <ProfileInfoCard />
        </div>
      </div>
      {user && <div className=" p-4">{children}</div>}
    </div>
  );
};

export default DashboardLayout;
