// This function runs when the button is clicked
/*      function greetUser() {
        let name = prompt("What's your name? \n ཁྱེད་རང་གི་མིང་ལ་ག་རེ་རེད།");
        if (name) {
          alert("Tashi Delek བཀྲ་ཤིས་བདེ་ལེགས།, " + name + "! 👋");
        } else {
          alert("You didn't enter a name.");
        }
      }
      */
// Initialize the map centered near Yumbhu Lhakhang
  // Initialize the map centered between Lhoka and Lhasa
  const map = L.map('map').setView([30.5, 85], 5);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const Guirong Valley = [38.57787, -110.7077];
  const University of Baffalo = [43.001, -78.790 ];
  const Charlestona = [39.288990, -77.859718 ]; 


  const storyPanel = document.getElementById('story-panel');

  // Marker for Yumbhu Lhakhang
  L.marker(GuirongValley).addTo(map)
    .bindPopup("📍 Guirong Valley")
    .on('click', () => {
      storyPanel.innerHTML = `
        <h2>📖 Guirong Valley </h2>
        <p><strong>Guirong Valley</strong> is the birthplace of Dorjee. He wasborn and raised there and lived happliy with his parents. Now this place is the boarderline between Nepal and China, after the China's Occupation.</p>
      `;
    });

  // Marker for Lhasa
  L.marker(UniversityofBaffalo).addTo(map)
    .bindPopup("📍 Univarsity of Baffalo")
    .on('click', () => {
      storyPanel.innerHTML = `
        <h2>📖 University of Baffalo </h2>
        <p><strong>University of Baffalo</strong>is the place where Dorjee studied Computer Science. It was the school, that changed his life from the very bottom.</p>
      `;
    });
    // Marker for Dharamsala
      L.marker(Charleston).addTo(map)
        .bindPopup("📍 Charleston")
        .on('click', () => {
          storyPanel.innerHTML = `
            <h2>📖 Charleston</h2>
            <p>After finding out about Chinese taking his parents, he moved to Charleston. There he used Computer Science toconnect with many work with them, and save other Childern all around the world who are suffering.</p>
          `;
        });
  const path = L.polyline([GuirongValley,UniversityofBaffalo, Charleston], {
    color: 'red',
    weight: 4
  }).addTo(map);

  map.fitBounds(path.getBounds(), {
    paddingTopLeft: [50, 50],
    paddingBottomRight: [50, 50],
    maxZoom: 7
  });


// My image slide with captions
      const slides = document.querySelectorAll('.carousel-slide');
      let current = 0;

      document.querySelector('.next-btn').addEventListener('click', () => {
        slides[current].classList.add('hidden');
        current = (current + 1) % slides.length;
        slides[current].classList.remove('hidden');
      });

      document.querySelector('.prev-btn').addEventListener('click', () => {
        slides[current].classList.add('hidden');
        current = (current - 1 + slides.length) % slides.length;
        slides[current].classList.remove('hidden');
      });

// Three capitals story block
     const storyBlocks = document.querySelectorAll('.story-block');

    const revealOnScroll = () => {
      storyBlocks.forEach(block => {
        const top = block.getBoundingClientRect().top;
        const bottom = block.getBoundingClientRect().bottom;

        if (top < window.innerHeight * 0.85 && bottom > 0) {
          block.classList.add('revealed');
        } else {
          block.classList.remove('revealed'); // Remove on scroll out
        }
      });
    };

    window.addEventListener('scroll', revealOnScroll);
    window.addEventListener('load', revealOnScroll);
