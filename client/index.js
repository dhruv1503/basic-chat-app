console.log("client available");
const body = document.body;

const input = document.querySelector("input");
const paragraph = document.querySelector("p");
const sendButton = document.querySelector("button");
const websocket = new WebSocket("ws://127.0.0.1:3000");
const chatbox = document.getElementsByClassName("chatbox")[0]

const name = window.prompt("What is your name?");

sendButton.addEventListener("click", () => {
    const message = input.value;
    if(message.trim()){
        console.log({name, message})
        websocket.send(JSON.stringify({name, message}))
        generateMessage(message, name)
        input.value = ""
    }
    else{
        window.alert("empty message connet be sent")
    }
})

websocket.onopen = () =>{
    websocket.send(JSON.stringify({type: "connection", name}))
}

websocket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if(data && data.sender && data.message){
       generateMessage(data.message, data.sender)
    }
}  

const generateMessage = (message, sender) => {
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message")
    if(sender === "server"){
        messageContainer.classList.add("message--server");
        messageContainer.innerHTML = `
        <p class="message__info">${message}</p> `
        return chatbox.appendChild(messageContainer)
    }
    else if(sender === name){
        messageContainer.classList.add("message--sent")
    }
    else{
        messageContainer.classList.add("message--recieved")
    }
    messageContainer.innerHTML = `<p class="message__sender">${sender}</p> 
   <p class="message__info">${message}</p> `
   console.log(messageContainer)

   chatbox.appendChild(messageContainer);
}

