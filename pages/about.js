import Head from '../components/head'
import Link from 'next/link'

class About extends React.Component {
    render() {
        return (
            <div>
                <Head title="about" />
                <Link href="/"><div>about page</div></Link>
            </div>
        )
    }
}

export default About