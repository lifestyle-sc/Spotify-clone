import React, { useEffect, useRef } from "react";

const steps = [
  "Welcome to Spotify Web App Clone",
  "Created by Momoh Oluwakayode",
  "Enjoy"
]

const Typing = () => {
  const words = steps;
  const wait = 3000;
  let txt = "";
  let wordIndex = 0;
  let isDeleting = false;
  const spanRef = useRef()

  useEffect(() => {
    type()
  }, [])

  const type = () => {
    const current = wordIndex % words.length;
    const currWord = words[current];

    // check if deleting
    if (isDeleting) {
      // delete word
      txt = currWord.substring(0, txt.length - 1);
    } else {
      // Type word
      txt = currWord.substring(0, txt.length + 1);
    }

    let typeSpeed = 500;

    if (isDeleting) {
      // change typespeed to deleting speed
      typeSpeed = 300;
    }

    if (!isDeleting && txt === currWord) {
      // change typespeed to pause period
      typeSpeed = wait;
      // is deleting becomes true
      isDeleting = true;
    } else if (isDeleting && txt === "") {
      // is deleting becomes false
      isDeleting = false;
      // move to the next word
      wordIndex++;
    }

    // // print the word on UI
    // this.txtElement.innerHTML = `
    // <span class="txt">${this.txt}</span>

    if(spanRef.current !== null){
      spanRef.current.innerText = `${txt}`
    }


    setTimeout(() => type(), typeSpeed);
  };

  return <span ref={(spanRef)} className="txt"></span>;
};

export default Typing;
