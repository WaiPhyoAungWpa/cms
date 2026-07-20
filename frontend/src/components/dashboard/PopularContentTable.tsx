import type { PopularContent } from "../../types/dashboard";

import "../../styles/components/dashboard/PopularContentTable.css";

interface Props {
    contents: PopularContent[];
}

export default function PopularContentTable({
    contents,
}: Props) {
    return (
        <section className="popular-content">

            <h2>Popular Content</h2>

            {contents.length === 0 ? (
                <p>No analytics data available.</p>
            ) : (
                <table className="popular-content-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>PagePath</th>
                            <th>Title</th>
                            <th>Views</th>
                        </tr>
                    </thead>

                    <tbody>
                        {contents.map((content, index) => (
                            <tr key={content.pagePath}>
                                <td>{index + 1}</td>

                                <td>{content.pagePath}</td>

                                <td>{content.title}</td> 

                                <td>
                                    {content.views.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

        </section>
    );
}