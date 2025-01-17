/* eslint-disable react/prop-types */

const PostCard = ({ imageUrl, altText, title, content }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img src={imageUrl} alt={altText} className="w-full h-48 object-cover" />
            <div className="p-4">
                <h3 className="text-lg font-semibold text-blue-600">{title}</h3>
                <p className="text-gray-600">{content}</p>
                <a href="#" className="text-blue-500 hover:text-blue-700">Read More...</a>
            </div>
        </div>
    );
};

const PetBlog = () => {
    return (
        <div className="ml-[16%] bg-gray-100 p-6">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-blue-600 mb-6">PET BLOG</h1>
                <div className="flex justify-center space-x-4 mb-6 overflow-x-auto">
                    <button className="px-4 py-2 rounded bg-gray-200 text-gray-800 border-2 border-gray-300 hover:bg-gray-300">All Posts</button>
                    <button className="px-4 py-2 rounded bg-blue-500 text-white border-2 border-blue-600 hover:bg-blue-600">Dogs</button>
                    <button className="px-4 py-2 rounded bg-pink-500 text-white border-2 border-pink-600 hover:bg-pink-600">Cats</button>
                </div>
            </div>
            <div className="flex gap-6 mb-8">
                <img
                    src="https://placehold.co/300x200"
                    alt="Kitten on a pumpkin"
                    className="rounded-lg w-1/3"
                />
                <div className="w-2/3 flex flex-col">
                    <h2 className="text-2xl font-bold mb-4">The Benefits of Pumpkin for Your Dog or Cat</h2>
                    <p className="text-gray-600">
                        Want to boost your cat or dog is diet with something nutritious? Pumpkin for pets can be a game changer, offering a rich source of nutrition and fiber to promote regular digestion. It is a simple yet effective way to enhance their diet—whether you have a playful pup or a curious...
                    </p>
                    <button className="px-4 py-2 rounded bg-blue-600 text-white mt-auto w-fit border-2 border-blue-700 hover:bg-blue-700">READ MORE</button>
                </div>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-blue-600 mb-4">NEWEST POSTS</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PostCard
                        imageUrl="https://placehold.co/400x300?text=Dog+Enrichment"
                        altText="Dogs playing"
                        title="Dog Enrichment Toys & Activities During Winter Months"
                        content="‘Tis the season for indoor activities that keep your fur baby moving, entertained and stimulated! And with the holidays knocking on our door, it’s the perfect time to treat your..."
                    />
                </div>
            </div>
        </div>
    );
};

export default PetBlog;
