

import React,{useState,useEffect} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client'
import './Chat.css'
import InforBar from '../InfoBar/InforBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages'

let socket;

function Chat({location}) {
const [name,setName] = useState('');
const [room,setRoom] = useState('');
const [message,setMessage] = useState('');
const [messages,setMessages] = useState([]);
const ENDPOINT = ('localhost:5000');

    useEffect( ()=>{
        const {name , room} =queryString.parse(location.search);
        setName(name);
        setRoom(room);
        socket = io(ENDPOINT);
        //console.log(socket);
        socket.emit('join', {name,room});

        return ()=>{

            socket.emit('disconnect');
            socket.off();
            
        }
        
    },[ENDPOINT,location.search]);

    useEffect( ()=>{
        socket.on('message', (message)=>{
            setMessages([...messages , message]);
        });
    },[messages]);

    //function for sending message
    const sendMessage =(event)=>{

        event.preventDefault();

        if(message){
            socket.emit('sendMessage', message, ()=>setMessage(''));
        }
    }

    console.log(message,messages);



    return (
        <div className="outerContainer">
         
         <div className="container">
             <InforBar room={room}/>
             <Messages messages={messages} name={name} />
             <Input message ={message} setMessage={setMessage} sendMessage={sendMessage}/>
             {/* <Messages messages={messages}/> */}
    

         </div>
        </div>
    )
}

export default Chat
