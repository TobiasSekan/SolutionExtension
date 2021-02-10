import { GlobalSection } from "../Classes/GlobalSection";
import { Solution } from "../Classes/Solution";
import { Keyword } from "../Constants/Keyword";

/**
 * Helper class to easier work with Solutions
 */
export class SolutionHelper
{
    /**
     * Return a GlobalSection of the given keyword from the given Solution
     * @param solution The solution that contain a list with GlobalSections
     * @param keyword The keyword of the global section
     */
    public static GetGlobalSection(solution: Solution, keyword: Keyword): GlobalSection|undefined
    {
        const keywordToFind = keyword.toLowerCase();

        const globalSection = solution.Global?.GlobalSections
            .find(find => find.Type.toLowerCase() === keywordToFind);

        return globalSection;
    }
}