 </button>
    <p>And JavaScript adds interactivity. This button shows an alert.</p>
       <h1>This is a &lt;script&gt; tag example</h1>
    <p>Click the button to enter your name and see JavaScript in action!</p>

    <button onclick="greetUser()">I will say Tashi Delek to your visior</button>
    <script>
      // This function runs when the button is clicked
      function greetUser() {
        let name = prompt("What's your name? \n ཁྱེད་རང་གི་མིང་ལ་ག་རེ་རེད།");
        if (name) {
          alert("Tashi Delek བཀྲ་ཤིས་བདེ་ལེགས།, " + name + "! 👋");
        } else {
          alert("You didn't enter a name.");
        }
      }
    </script>
