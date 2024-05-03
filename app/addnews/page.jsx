'use client'
import React, { useState } from 'react';
import ImageUploadComponent from '../../components/ImageUploadComponent'; 
import { collection, addDoc ,doc , getDoc,updateDoc} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import { db } from "../../firebase";


function NewsForm() {

    const auth = getAuth(); 

    const [newsData, setNewsData] = useState({
        district: '',
        districtEn: '',
        photos: [],
        article: '',
        headline: '',
        title: '',
        author: "test-user",
        views: 13444,
        metaTags: {
            title: '',
            description: "test desc",
            keywords: '',
            author: "test-user",
            ogTitle: 'test-title',
            ogDescription: 'test-description',
            ogUrl: 'test-url',
            ogImage: 'test-og image',
            ogLocale: 'test-locale',
            twitterCard: 'test-card',
            twitterSite: 'test-site',
            twitterCreator: 'test-creator',
        },
        category: '',
        date: new Date(),
    });

    const districtsEn = [
        'Bagalkot', 'Bangalore Rural', 'Bangalore Urban', 'Belgaum', 'Bellary', 'Bidar', 'Bijapur', 'Chamarajanagar', 'Chikkamagaluru', 'Chikkaballapur', 'Chitradurga', 'Davanagere', 'Dharwad', 'Dakshina Kannada', 'Gadag', 'Gulbarga', 'Hassan', 'Haveri district', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysore', 'Raichur', 'Shimoga', 'Tumkur', 'Udupi', 'Uttara Kannada', 'Ramanagara', 'Yadgir'
    ];

    const districts = [
        'ಬಾಗಲಕೋಟೆ', 'ಬೆಂಗಳೂರು ಗ್ರಾಮೀಣ', 'ಬೆಂಗಳೂರು ನಗರ', 'ಬೆಳಗಾವಿ', 'ಬಳ್ಳಾರಿ', 'ಬೀದರ್', 'ಬಿಜಾಪುರ', 'ಚಾಮರಾಜನಗರ', 'ಚಿಕ್ಕಮಗಳೂರು', 'ಚಿಕ್ಕಬಳ್ಳಾಪುರ', 'ಚಿತ್ರದುರ್ಗ', 'ದಾವಣಗೆರೆ', 'ಧಾರವಾಡ', 'ಧಾರ್ವಾಡ', 'ದಕ್ಷಿಣ ಕನ್ನಡ', 'ಗದಗ', 'ಗುಲ್ಬರ್ಗಾ', 'ಹಾಸನ', 'ಹಾವೇರಿ ಜಿಲ್ಲೆ', 'ಕೋಡಗು', 'ಕೋಲಾರ', 'ಕೊಪ್ಪಲ್', 'ಮಂಡ್ಯ', 'ಮೈಸೂರು', 'ರಾಯಚೂರು', 'ಶಿವಮೊಗ್ಗ', 'ತುಮಕೂರು', 'ಉಡುಪಿ', 'ಉತ್ತರ ಕನ್ನಡ', 'ರಾಮನಗರ', 'ಯಾದಗಿರಿ'
    ];

    const categories = [
        'ಆರೋಗ್ಯ',
        'ಆಹಾರ',
        'ಪ್ರಯಾಣ',
        'ಹಬ್ಬಗಳು',
        'ವಾಣಿಜ್ಯ',
        'ಕೆಲವು ಹೊಸ ವರ್ಗಗಳು'
    ];

    const [showUpload, setShowUpload] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setNewsData({
                ...newsData,
                [parent]: {
                    ...newsData[parent],
                    [child]: value
                }
            });
        } else {
            setNewsData({
                ...newsData,
                [name]: value
            });
        }
    };

    const handleImagesUploaded = (uploadedImages) => {
        setNewsData((prevData) => ({
            ...prevData,
            photos: [...uploadedImages]
        }));
    };
   

    
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         // Add the newsData to the 'dailynews' collection in Firestore
    //         const docRef = await addDoc(collection(db, 'dailynews'), newsData);
    //         console.log("Data successfully added to 'dailynews' collection with ID: ", docRef.id);
            
    //         // Get the current user
    //         const user = auth.currentUser;
    //         console.log(user.uid)

    //         if (user) {
    //             // Fetch the user document from the 'users' collection
    //             const userDocRef = doc(db, 'publishers', user.uid);
    //             const userDocSnap = await getDoc(userDocRef);
    //             console.log(userDocSnap.data())

    //             if (userDocSnap.exists()) {
    //                 // Update user document with submission details
    //                 await updateDoc(userDocRef, {
    //                     articlesPublished: userDocSnap.data().articlesPublished + 1, // Increment the number of articles published
    //                     publishedArticleIds: [...userDocSnap.data().publishedArticleIds, docRef.id] // Add the ID of the published article
    //                 });
    //                 console.log("User document updated with submission details.");
    //             } else {
    //                 console.error("User document does not exist.");
    //             }
    //         } else {
    //             console.error("No user is currently signed in.");
    //         }
    //     } catch (error) {
    //         console.error("Error adding document or updating user document: ", error);
    //     }
    // };
 

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const docRef = await addDoc(collection(db, 'dailynews'), newsData);
            console.log("Data successfully added to 'dailynews' collection with ID: ", docRef.id);
            
            const user = auth.currentUser;

            if (user) {
                const userDocRef = doc(db, 'publishers', user.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    await updateDoc(userDocRef, {
                        articlesPublished: userDocSnap.data().articlesPublished + 1,
                    });

                    // Create a reference to the published article
                    const articleRef = doc(db, 'dailynews', docRef.id);

                    // Update user document with the reference to the published article
                    await updateDoc(userDocRef, {
                        publishedArticles: [...userDocSnap.data().publishedArticles, articleRef]
                    });

                    console.log("User document updated with submission details.");
                } else {
                    console.error("User document does not exist.");
                }
            } else {
                console.error("No user is currently signed in.");
            }
        } catch (error) {
            console.error("Error adding document or updating user document: ", error);
        }
    }; 


    function handleUploadpage(){
        if (newsData.metaTags.title.trim() !== '') {
            setShowUpload(true);
        }
    }

    return (
        <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="district-en-select" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select District (English)</label>
                <select id="district-en-select" name="districtEn" value={newsData.districtEn} onChange={handleChange} className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black" required>
                    <option value="">Select a district</option>
                    {districtsEn.map((district) => (
                        <option key={district} value={district}>{district}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="district-select" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select District (Kannada)</label>
                <select id="district-select" name="district" value={newsData.district} onChange={handleChange} className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black" required>
                    <option value="">Select a district</option>
                    {districts.map((district) => (
                        <option key={district} value={district}>{district}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="category-select" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Category</label>
                <select id="category-select" name="category" value={newsData.category} onChange={handleChange} className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black" required>
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="headline-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Headline</label>
                <input type="text" id="headline-input" name="headline" value={newsData.headline} onChange={handleChange} className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            </div>

            <div className="mb-5">
                <label htmlFor="meta-title-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Page Title (In English)</label>
                <input type="text" id="meta-title-input" name="metaTags.title" value={newsData.metaTags.title} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                <button onClick={handleUploadpage}>Upload Image</button>
            </div>

            {showUpload && (
                <div className="mb-5">
                    <label htmlFor="photo-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Photos</label>
                    <ImageUploadComponent onImagesUploaded={handleImagesUploaded} blogname={newsData.metaTags.title} />
                </div>
            )}

            <div className="mb-5">
                <label htmlFor="article-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">News Article</label>
                <input type="text" id="article-input" name="article" value={newsData.article} onChange={handleChange} className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            </div>

            <div>
                <h3>Meta Details</h3>
                <div>
                    <label htmlFor="keywords-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Keywords: [related 4 english words]</label>
                    <input type="text" id="keywords-input" name="metaTags.keywords" value={newsData.metaTags.keywords} onChange={handleChange} className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>
            </div>

            <button type="submit" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit</button>
        </form>
    );
}

export default NewsForm;
