import * as React from 'react';
import { Button } from './Button';
import { Credentials } from '../DTO/Credentials';
import './../HtmlStyles/Auth';

interface IProps<T>
{
    onLoginSuccess(data: T): void;
}

interface IState
{
    id: string;
    password: string;
    status: string;
}

export class Auth<T> extends React.Component<IProps<T>, IState>
{
    private IsAuthorized = false;

    constructor(props: any)
    {
        super(props);

        this.state = {
            id: window.localStorage.getItem('id') || "",
            password: window.localStorage.getItem('password') || "",
            status: ""
        };
    }

    async componentDidMount()
    {
        if (window.localStorage.getItem('id') !== null)
        {
            await this.TryLogin();
        }
    }

    render()
    {
        return (
            <div className="form">
                <div className="row">
                    <div className="label">ID:</div>
                    <input type="text"
                        placeholder="Name, email or whatever"
                        value={this.state.id}
                        onChange={x => this.setState({ id: x.target.value })} />
                </div>
                <div className="row">
                    <div className="label">Password:</div>
                    <input type="password"
                        placeholder=""
                        value={this.state.password}
                        onChange={x => this.setState({ password: x.target.value })} />
                </div>
                <div className="actions">
                    <Button label="LOGIN" onClick={() => this.LoginButton_Click()} />
                </div>
                <div className="status">
                    {this.state.status}
                </div>
            </div>
        );
    }

    private async TryLogin()
    {
        const credentials = new Credentials();
        credentials.Id = this.state.id.trim();
        credentials.Password = this.state.password.trim();

        this.setState({ status: "Trying to login..." });

        const response = await fetch(process.env.AUTH!, { method: "POST", body: JSON.stringify(credentials) });

        if (response.status === 200)
        {
            this.setState({ status: "Authorized." });

            const data: T = await response.json();

            this.IsAuthorized = true;

            window.localStorage.setItem('id', credentials.Id);
            window.localStorage.setItem('password', credentials.Password);

            this.props.onLoginSuccess(data);
        }
        else
            if (response.status === 401)
            {
                this.setState({ status: "Unauthorized" });
            }
            else
                this.setState({ status: `Unknown problem (${response.status})` });

    }

    private async LoginButton_Click(): Promise<void>
    {
        await this.TryLogin();
    }
}