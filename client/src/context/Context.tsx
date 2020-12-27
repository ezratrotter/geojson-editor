import * as React from "react";
// import RestaurantFinder, { Restaurant, Review } from "../apis/RestaurantFinder";
import axios from "axios";
import { GeometryUtil } from "leaflet";

//leaflet import #TODO work out why this is so ghetto
// potentially not needed
// const L = window.L;

const instance = axios.create({
  baseURL: "http://localhost:3001/api/v1",
});

interface User {
  user_id: number;
  username: string;
}

type Context = {
  loggedIn: boolean;
  user: User;
  logIn: (e: any, username: string, password: string) => void;
  logOut: () => void;
  createNewUser: (e: any, username: string, password: string) => void;
  addGeometry: (e: any) => void;
  editGeometry: (e: any) => void;
  deleteGeometry: (e: any) => void;
  submitGeometries: (e: any) => void;
};

interface AppProviderProps {
  children: React.ReactNode;
}

export const UserContext = React.createContext({} as Context);

export const UserProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = React.useState({} as User);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [geometries, setGeometries] = React.useState([]);

  React.useEffect(() => {
    console.log("rerender");
    console.log(geometries);
  }, [geometries]);

  const addGeometry = (e: any) => {
    const { layer } = e;
    const { _leaflet_id } = layer;
    const fullGeojson = layer.toGeoJSON();
    const layerGeojson = fullGeojson.geometry;
    // const id = Date.now();
    const entry = {
      id: _leaflet_id,
      geometry: JSON.stringify(layerGeojson),
    };
    setGeometries([...geometries, entry]);
  };

  const editGeometry = (e) => {
    const _layers = e.layers._layers;
    const id = Number(Object.keys(_layers)[0]);
    const layer = Object.values(_layers)[0];
    // @ts-ignore:
    const fullGeojson = layer.toGeoJSON();
    const layerGeojson = fullGeojson.geometry;
    const geometry = JSON.stringify(layerGeojson);

    const entry = {
      id,
      geometry,
    };

    setGeometries((prevState) =>
      prevState.map((geometry) => {
        debugger;
        if (geometry.id === entry.id) {
          return { ...geometry, geometry: entry.geometry };
        }
        return geometry;
      })
    );
  };
  const deleteGeometry = (e) => {
    const _layers = e.layers._layers;
    const id = Number(Object.keys(_layers)[0]);
    const layer = Object.values(_layers)[0];
    // @ts-ignore:
    const fullGeojson = layer.toGeoJSON();
    const layerGeojson = fullGeojson.geometry;
    const geometry = JSON.stringify(layerGeojson);

    const entry = {
      id,
      geometry,
    };

    debugger;
    // setGeometries((prevState) =>
    //   prevState.filter((geometry) => geometry.id !== entry.id)
    // );
  };

  const authenticatePwd = (clientPwd: string, serverPwd: string): boolean => {
    console.log("---password check---", clientPwd, serverPwd);
    if (clientPwd === serverPwd) return true;
    else return false;
  };

  const submitGeometries = async (e: any) => {
    console.log("submit geometries attempted");
    e.preventDefault();
    try {
      const response = await instance.put(`/geometries/${user}`, {
        geometries,
      });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const logIn = async (
    uiUsername: string,
    uiPassword: string
  ): Promise<any> => {
    console.log("login attempted");
    try {
      const response = await instance.get(`/user/${uiUsername}`);
      console.log(response);
      const { username, password, user_id } = response.data.results;
      const authenticated = authenticatePwd(uiPassword, password);
      if (authenticated) {
        setUser({
          user_id,
          username,
        });
        setLoggedIn(true);
      } else {
        // do some kind of login rejection
      }
    } catch (err) {
      console.log(err);
    }
  };

  const createNewUser = async (
    uiUsername: string,
    uiPassword: string
  ): Promise<any> => {
    console.log("create use attempted");
    try {
      const response = await instance.post("/createUser", {
        uiUsername,
        uiPassword,
      });
      const { username, user_id } = response.data.results;
      setUser({
        user_id,
        username,
      });
      setLoggedIn(true);
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const logOut = (): void => {
    console.log("logout Attempted");
    setUser({ user_id: null, username: "" });
    setLoggedIn(false);
  };

  return (
    <UserContext.Provider
      value={{
        loggedIn,
        user,
        logIn,
        logOut,
        createNewUser,
        addGeometry,
        editGeometry,
        deleteGeometry,
        submitGeometries,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = React.useContext(UserContext);
  return context;
};
