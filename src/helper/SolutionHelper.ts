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

    /**
     * Return the name of a Visual Studio for the given Visual Studio version
     * @param version The full version number of a Visual Version
     */
    public static GetVisualStudioName(version: string): string
    {
        var versionSplit = version.split(".");
        if(versionSplit.length < 2)
        {
            return "Unknown Visual Studio version";
        }

        const major = parseInt(versionSplit[0]);
        switch(major)
        {
            case 5:
                return "Visual Studio 97 (1997)";
                
            case 6:
                return "Visual Studio 6.0 (1998)";

            case 7:
            {
                const minor = parseInt(versionSplit[1]);
                switch(minor)
                {
                    case 0:
                        return "Visual Studio .NET (2002)";

                    case 1:
                        return "Visual Studio .NET 2003";
                }
            }

            case 8:
                return "Visual Studio 2005";

            case 9:
                return "Visual Studio 2008";

            case 10:
                return "Visual Studio 2010";

            case 11:
                return "Visual Studio 2012";

            case 12:
                return "Visual Studio 2013";

            case 14:
                return "Visual Studio 2015";

            case 15:
                return "Visual Studio 2017";

            case 16:
                return "Visual Studio 2019";
        }

        return "Unknown Visual Studio version";
    }
}