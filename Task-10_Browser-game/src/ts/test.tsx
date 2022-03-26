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

result = <button class="game_button">123</button>
result.onclick = () => alert(123);

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
        <HTMLTags.TableData>1</HTMLTags.TableData>
        <HTMLTags.TableData>2</HTMLTags.TableData>
    </HTMLTags.TableRow>
</HTMLTags.Table>

mainDisplay.append(result);