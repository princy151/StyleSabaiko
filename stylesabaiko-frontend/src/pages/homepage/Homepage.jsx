import Hero from "../../components/Hero/Hero"
import NewCollections from "../../components/NewCollections/NewCollections"
import Popular from "../../components/Popular/Popular"

const HomePage = () => {
    return (
        <div>
            <Hero />
            <Popular />
            <NewCollections/>
        </div>
    )
}
export default HomePage