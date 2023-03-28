import { React } from "./dep.ts";
interface AppProps {
    games?: Game[];
}
interface Game {
  title: string;
  level: string;
}

function App({ games = [] }: AppProps) {
    return (
      <div>
        <div className="jumbotron jumbotron-fluid">
          <div className="container">
            <h1 className="display-4">王者段位排行榜</h1>
            <GameRanks items={games} />
          </div>
        </div>
      </div>
    );
  }
  interface GameRanks{
    items: Game[]
  }
  function GameRanks({ items = [] }: GameRanks) {
    return (
      <div>
        <ul className="list-group">
          {items.map((game: any, index: number) => {
            return (
              <li
                key={index}
                className="list-group-item"
                style={{ color: "green" }}
              >
                {game.level}
                <span
                  className="ml-2 mb-1 close"
                >
                    {game.title}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
  
  export default App;