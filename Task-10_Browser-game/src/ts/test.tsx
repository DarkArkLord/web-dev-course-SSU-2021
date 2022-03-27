const mainDisplay = document.getElementById('main_disp');
mainDisplay.innerHTML = '';

let result: HTMLElement;
result =
    <table>
        <tr>
            <td>1</td>
            <td>2</td>
        </tr>
        <tr>
            <td>3</td>
            <td>4</td>
        </tr>
    </table>;

mainDisplay.append(result);

const tclass = 'game_button';
result = <button class={tclass}>{tclass}</button>
result.onclick = () => alert(tclass);

mainDisplay.append(result);

enum HTMLTags {
    Table = 'table',
    TableRow = 'tr',
    TableData = 'td',
    h2 = 'h2',
    TextArea = 'textarea',
    Button = 'button',
    Div = 'div',
}

result = 
<HTMLTags.Table>
    <HTMLTags.TableRow>
        <HTMLTags.TableData>t1</HTMLTags.TableData>
        <HTMLTags.TableData>t2</HTMLTags.TableData>
    </HTMLTags.TableRow>
</HTMLTags.Table>

mainDisplay.append(result);