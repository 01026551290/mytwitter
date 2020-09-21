import React, {useState} from "react";
import {dbService, storageService} from "../fbase";
import {v4 as uuidv4} from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const MyWitterFactory = ({userObj ,}) => {
    const [myWitter , setMyWitter] = useState("");
    const [attachment , setAttachment] = useState("");
    const onSubmit = async (event) => {
        if (myWitter === "") {
            return;
        }
        event.preventDefault();
        let attachmentUrl = "";
        if(attachment !== "") {
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const reponse = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await reponse.ref.getDownloadURL();
        }
        const myWitterObj = {
            text: myWitter,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        };
        await dbService.collection("myWitters").add(myWitterObj);
        setMyWitter("");
        setAttachment("");
    }
    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setMyWitter(value);
    };
    const onFileChange = (event) => {
        const {
            target: {files},
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: {result},
            } = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    };
    const onClearPhotoClick = () => setAttachment("");
    return (
        <form onSubmit={onSubmit} className="factoryForm">
            <input type="text" value={myWitter} onChange={onChange} placeholder="What's on your mind" maxLength={120} className="factoryInput__input"/>
            <input type="submit" value="&rarr;" className="factoryInput__arrow" />
            <label htmlFor="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus}/>
            </label>
            <input type="file" id="attach-file" accept="image/*" onChange={onFileChange} style={{opacity: 0,}} />
            {attachment && (
                <div className="factoryForm__attachment">
                    <img src={attachment} style={{backgroundImage: attachment,}} />
                    <button className="factoryForm__clear" onClick={onClearPhotoClick}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
            )}
        </form>
    );
};

export default MyWitterFactory;