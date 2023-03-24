import { useEffect, useRef } from 'react';
import { useStateCallback } from '../Hooks/useStateCallback';
import '../Style/EnableSelectList.css';

/**
 * 可选择List
 * @param {} props
 * @returns
 */
const EnableSelectList = (props) => {
    const [dataSource, setDataSource] = useStateCallback([]);
    const [isShow, setIsShow] = useStateCallback(false);

    const inputRef = useRef();

    var curSelectedIndex = 0;

    useEffect(() => {
        setDataSource(props.dataSource);
        setIsShow(props.isShow);

        curSelectedIndex = 0;
        markItem(document.getElementById('select-list').querySelectorAll('li'));

        if (props.isShow && inputRef.current) setTimeout(() => inputRef.current.focus(), 100);

        var input = document.getElementById('select-input');

        input.removeEventListener('keydown', onInputKeyDown);
        input.addEventListener('keydown', onInputKeyDown);

        return () => {
            input.removeEventListener('keydown', onInputKeyDown);
        };
    }, [props.dataSource, props.isShow]);

    /**
     * 建立Input事件监听器
     * @param {*} e
     */
    const onInputKeyDown = (e) => {
        const selectorList = document.getElementById('select-list');
        const selectorOptions = selectorList.querySelectorAll('li');

        switch (e.key) {
            case 'Enter':
                onClickItem(dataSource[curSelectedIndex].value);
                break;
            case 'ArrowUp':
                curSelectedIndex--;
                curSelectedIndex = Math.max(0, curSelectedIndex);
                markItem(selectorOptions);
                break;
            case 'ArrowDown':
                curSelectedIndex++;
                curSelectedIndex = Math.min(dataSource.length - 1, curSelectedIndex);
                markItem(selectorOptions);
                break;
        }
    };

    /**
     * 标记当前选中的Item
     * @param {*} list
     */
    function markItem(list) {
        list.forEach((item, index) => {
            if (index === curSelectedIndex) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }

    /**
     * 当选中了Item
     * @param {} value
     */
    function onClickItem(value) {
        props.submitCallback(value);
    }

    return (
        <div id="enable-select-list-root">
            <input id="select-input" ref={inputRef} />
            <ul id="select-list">
                {dataSource.map((item, index) => (
                    <li
                        className={index === 0 ? 'selected' : ''}
                        key={index}
                        onClick={() => onClickItem(item.value)}
                    >
                        {item.item}
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default EnableSelectList;
