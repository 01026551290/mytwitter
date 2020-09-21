import React, {useEffect, useState} from "react";
import {authService, dbService} from "../fbase";
import {useHistory} from "react-router-dom";

export default ( {refreshUser,userObj}) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };
    const getMyWitters = async () => {
        const myWitters = await dbService.collection("myWitters").where("creatorId", "==" , userObj.uid).orderBy("createdAt").get();
        console.log(myWitters.docs.map(doc => doc.data()));
    }
    useEffect(() => {
        getMyWitters();
    }, []);
    const onSubmit = async (event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName){
            await userObj.updateProfile({
                displayName: newDisplayName,
            });
            refreshUser();
        }
    };
    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setNewDisplayName(value);
    };
    return (
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input type="text" placeholder="Display name" autoFocus value={newDisplayName} onChange={onChange} className="formInput" />
                <input type="submit" value="Updata Profile"  className="formBtn" style={{marginTop: 10,}} />
            </form>
            <span onClick={onLogOutClick} className="formBtn cancelBtn logOut">Log Out</span>
        </div>
    )
};