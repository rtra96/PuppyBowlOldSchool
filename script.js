const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2308-FTB-MT-WEB-PT';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/2308-FTB-MT-WEB-PT`;


const fetchAllPlayers = async () => {
    try {
        const res = await fetch(`${APIURL}/players/`);

        console.log('Raw Response:', res);

        if (!res.ok) {
            console.error(`Failed to fetch players. Status: ${res.status}`);
            return null;
        }

        const jsonData = await res.json();

        console.log('Fetched players:', jsonData);

        const playersArray = jsonData.data?.players;

        if (Array.isArray(playersArray)) {
            return playersArray;
        } else {
            console.error('Error: fetchAllPlayers did not return an array of players.');
            return null;
        }

    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
        return null;
    }
};


const fetchSinglePlayer = async (playerId) => {
    try {
        const res = await fetch(`${APIURL}/players/${playerId}`);
        const json = await res.json();
        return json;

    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async (playerObj) => {
    try {
        const res = await fetch(`${APIURL}/players`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(playerObj),
        });

        if (res.ok) {
            const updatedPlayers = await fetchAllPlayers();
            renderAllPlayers(updatedPlayers);
        } else {
            console.error('Failed to add a new player. Please try again.');
        }
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (playerId) => {
    try {
        const res = await fetch(`${APIURL}/players/${playerId}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            const updatedPlayers = await fetchAllPlayers();
            renderAllPlayers(updatedPlayers);
        } else {
            console.error(`Failed to remove player #${playerId}. Please try again.`);
        }
    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};


/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (playerList) => {
    try {
        let playerContainerHTML = '';

        playerList.forEach((player) => {
            playerContainerHTML += `
                <div class="player-card">
                    <h3>${player.name}</h3>
                    <div class="img"><img src="${player.imageUrl}" /></div>
                    <p>Breed: ${player.breed}</p>
                    <p>Status: ${player.status}</p>
                    <button class="details-btn" data-player-id="${player.id}">See Details</button>
                    <button class="remove-btn" data-player-id="${player.id}">Remove from Roster</button>
                </div>
            `;
        });

        playerContainer.innerHTML = playerContainerHTML;

        // Add event listeners to the buttons
        document.querySelectorAll('.details-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const playerId = event.target.dataset.playerId;
                const response = await fetchSinglePlayer(playerId);
        
                if (response && response.success) {
                    const playerDetails = response.data.player;
        
                    // Hide all player cards
                    document.querySelectorAll('.player-card').forEach(card => {
                        card.style.display = 'none';
                    });
        
                    // Create HTML for the selected player
                    const selectedPlayerHTML = `
                        <div class="player-card">
                            <h3>${playerDetails.name}</h3>
                            <div class="img"><img src="${playerDetails.imageUrl}" /></div>
                            <p>Breed: ${playerDetails.breed}</p>
                            <p>Status: ${playerDetails.status}</p>
                            <button class="close-btn">Close Details</button>
                        </div>
                    `;
        
                    // Append the selected player HTML to a container
                    const detailsContainer = document.getElementById('details-container');
                    detailsContainer.innerHTML = selectedPlayerHTML;
        
                    // Add event listener to the close button
                    const closeDetailsButton = detailsContainer.querySelector('.close-btn');
                    closeDetailsButton.addEventListener('click', () => {
                        // Show all player cards again
                        document.querySelectorAll('.player-card').forEach(card => {
                            card.style.display = 'block';
                        });
        
                        // Clear the details container
                        detailsContainer.innerHTML = '';
                    });
                } else {
                    console.error('Failed to fetch player details');
                }
            });
        });
        
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const playerId = event.target.dataset.playerId;
                removePlayer(playerId);
            });
        });

    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};


/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    try {
        
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}

const init = async () => {
    try {
        const players = await fetchAllPlayers();

        // Check if players is an array before rendering
        if (Array.isArray(players)) {
            renderAllPlayers(players);
        } else {
            console.error('Error: fetchAllPlayers did not return an array.');
        }

        renderNewPlayerForm();
    } catch (error) {
        console.error('Error during initialization:', error);
    }
};

init();

const closeDetails = () => {
    // Show all player cards again
    document.querySelectorAll('.player-card').forEach(card => {
        card.style.display = 'block';
    });

    // Clear the details container
    const detailsContainer = document.getElementById('details-container');
    detailsContainer.innerHTML = '';
};