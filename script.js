class App extends React.Component {
    constructor() {
        super();
        this.state = {
            searchText: '',
            users: []
        };
    }

    onChangeHandle(e) {
        this.setState({searchText: e.target.value})
    }

    onSubmit(e) {
        e.preventDefault();
        const {searchText} = this.state;
        const url = `http://cors-anywhere.herokuapp.com/https://api.github.com/search/users?q=${searchText}`;
        fetch(url)
            .then(response => response.json())
            .then(responseJSON => {
                const users = responseJSON.items;

                const promises = users.map(user => {
                    return fetch(user.organizations_url)
                        .then(res => res.json())
                        .then(data => {
                            user.orgs = data;  
                            
                            return user;
                        });
                });  
                
                Promise.all(promises).then(users => {
                    console.log(users);
                    this.setState({ users });
                });
            });        
    }

    render() {
        return (
            <div className={'search-bar'}>
                <form onSubmit={e => this.onSubmit(e)}>
                    <label htmlFor="searchText"> Search by User Name: </label>
                    <input
                        type="text"
                        id="searchText"
                        onChange={e => this.onChangeHandle(e)}
                        value={this.state.searchText} />
                </form>
                <UserList users={this.state.users} />
            </div>
        );
    }
}

const UserList = props => (
    <div className={'container'}>
        {props.users.map(user => <User key={user.id} user={user} />)}
    </div>
);

const User = props => (
    <div className={'user-info'}>
        <img className={'avatar'} src={props.user.avatar_url} style={{maxWidth: '150px'}} />
        <a className={'user-nickname'} href={props.user.html_url} target="_blank">{props.user.login}</a>
        <div className={'orgList'}>
            {props.user.orgs.map(org => <OrgAvatar key={org.id} avatar_url={org.avatar_url} />)}
        </div>
    </div>
);


const OrgAvatar = props => (
    <img className={'orgAvatar'} src={props.avatar_url} />
);

ReactDOM.render(
    <App />,
    document.getElementById('root')
);