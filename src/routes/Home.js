import React, {useEffect, useState} from "react";
import {dbService} from "../fbase";
import MyWitter from "../components/Mywitter";
import MyWitterFactory from "../components/MyWitterFactory";


const Home = ({ userObj }) => {
    const [myWitters , setMyWitters] = useState([]);
    useEffect(() =>{
        dbService.collection("myWitters").onSnapshot(snapshot => {
            const myWitterArray = snapshot.docs.map( (doc) =>  ({
                id:doc.id,
                ...doc.data(),
            }));
            setMyWitters(myWitterArray);
        });
    }, []);
    return (
        <div className="container">
            <MyWitterFactory userObj={userObj} />
            <div style={{ marginTop: 30 }}>
                {myWitters.map(myWitter => (
                    <MyWitter key={myWitter.id} myWiiterObj={myWitter} isOwner={myWitter.creatorId === userObj.uid} />
                ))}
            </div>
        </div>
    );
};
export default Home;